package com.coirmiq.ticket.service;

import com.coirmiq.ticket.domain.entity.*;
import com.coirmiq.ticket.exception.PaymentFailedException;
import com.coirmiq.ticket.exception.ResourceNotFoundException;
import com.coirmiq.ticket.exception.SeatAlreadyLockedException;
import com.coirmiq.ticket.repository.BookingRepository;
import com.coirmiq.ticket.repository.EventInventoryRepository;
import com.coirmiq.ticket.repository.TicketRepository;
import com.coirmiq.ticket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final BookingRepository bookingRepository;
    private final EventInventoryRepository eventInventoryRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final MockPaymentService mockPaymentService;
    private final StringRedisTemplate redisTemplate;

    @Lazy
    @Autowired
    private CheckoutService self;

    /**
     * Executes the highly concurrent checkout flow:
     * 1. Creates a PENDING booking.
     * 2. Attempts to lock seats in Redis.
     * 3. Invokes payment service.
     * 4. Updates Booking to CONFIRMED, decrements seats (optimistic lock), and creates tickets.
     * 5. Releases Redis locks and updates status to FAILED on any failure.
     */
   public Booking processCheckout(UUID userId, UUID eventInventoryId, List<String> seatNumbers) {
        log.info("Starting checkout process for user {} and inventory {}", userId, eventInventoryId);

        // Fetch User and Event Inventory
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        EventInventory inventory = eventInventoryRepository.findById(eventInventoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Event inventory not found with ID: " + eventInventoryId));

        if (inventory.getAvailableSeats() < seatNumbers.size()) {
            throw new IllegalArgumentException("Requested seat count exceeds available seats.");
        }

        // Calculate total amount
        BigDecimal totalAmount = inventory.getPrice().multiply(BigDecimal.valueOf(seatNumbers.size()));

        // Step 1: Create a PENDING booking in a new transaction
        Booking booking = self.createPendingBooking(user, totalAmount);

        List<String> lockedRedisKeys = new ArrayList<>();
        try {
            // Step 2: Set atomic keys in Redis with a 5-minute TTL
            for (String seat : seatNumbers) {
                String lockKey = String.format("event:%s:row:%s:seat:%s", 
                        inventory.getEvent().getId(), inventory.getRow().getId(), seat);
                Boolean success = redisTemplate.opsForValue().setIfAbsent(lockKey, userId.toString(), java.time.Duration.ofMinutes(5));
                if (success == null || !success) {
                    throw new SeatAlreadyLockedException("Seat " + seat + " is already temporarily locked.");
                }
                lockedRedisKeys.add(lockKey);
            }

            // Step 3 & 4: Process payment and confirm booking in a transaction
            try {
                self.confirmBooking(booking.getId(), eventInventoryId, seatNumbers);
            } catch (org.springframework.orm.ObjectOptimisticLockingFailureException e) {
                throw new SeatAlreadyLockedException("Inventory updated by another user. Please retry.");
            } catch (org.springframework.dao.DataIntegrityViolationException e) {
                log.error("Database unique constraint triggered after payment. Refunding user.");
                mockPaymentService.refundPayment();
                throw new SeatAlreadyLockedException("A seat was permanently locked during payment processing. You have been automatically refunded.");
            }

            // Fetch the updated booking to return
            return bookingRepository.findById(booking.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        } catch (Exception e) {
            log.error("Checkout failed, releasing locked seats and marking booking as FAILED. Error: {}", e.getMessage());

            // Release the Redis locks for seats locked during this request
            for (String key : lockedRedisKeys) {
                redisTemplate.delete(key);
            }

            // Mark booking as FAILED in a separate transaction
            self.markBookingAsFailed(booking.getId());

            throw e;
        }
    }
   
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Booking createPendingBooking(User user, BigDecimal totalAmount) {
        Booking booking = Booking.builder()
                .user(user)
                .bookingTime(LocalDateTime.now())
                .totalAmount(totalAmount)
                .status(BookingStatus.PENDING)
                .build();
        return bookingRepository.save(booking);
    }

    @Transactional
    public void confirmBooking(UUID bookingId, UUID eventInventoryId, List<String> seatNumbers) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        EventInventory inventory = eventInventoryRepository.findById(eventInventoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Event inventory not found"));

        // Verify seats are not permanently booked
        for (String seat : seatNumbers) {
            if (ticketRepository.existsByEventInventoryIdAndSeatNumber(eventInventoryId, seat)) {
                throw new SeatAlreadyLockedException("A requested seat was permanently booked by another user during checkout.");
            }
        }

        // Step 3: Call MockPaymentService
        boolean paymentSuccess = mockPaymentService.processPayment();
        if (!paymentSuccess) {
            throw new PaymentFailedException("Payment processing failed.");
        }

        // Step 4: Decrement available_seats (optimistic locking @Version checked on save)
        if (inventory.getAvailableSeats() < seatNumbers.size()) {
            throw new IllegalArgumentException("Not enough seats available in this row.");
        }
        inventory.setAvailableSeats(inventory.getAvailableSeats() - seatNumbers.size());
        eventInventoryRepository.save(inventory);

        // Insert Ticket records for exact seat allocations
        for (String seat : seatNumbers) {
            Ticket ticket = Ticket.builder()
                    .eventInventory(inventory)
                    .seatNumber(seat)
                    .build();
            booking.addTicket(ticket);
        }

        // Confirm booking
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markBookingAsFailed(UUID bookingId) {
        bookingRepository.findById(bookingId).ifPresent(booking -> {
            booking.setStatus(BookingStatus.FAILED);
            bookingRepository.save(booking);
        });
    }
}
