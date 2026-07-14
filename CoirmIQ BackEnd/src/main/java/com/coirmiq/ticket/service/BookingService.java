package com.coirmiq.ticket.service;

import com.coirmiq.ticket.domain.entity.Booking;
import com.coirmiq.ticket.domain.entity.Role;
import com.coirmiq.ticket.exception.ResourceNotFoundException;
import com.coirmiq.ticket.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coirmiq.ticket.specification.BookingSpecification;
import org.springframework.data.jpa.domain.Specification;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    @Transactional(readOnly = true)
    public Page<Booking> getBookingsByUserId(UUID userId, Pageable pageable) {
        log.info("Fetching bookings for user ID: {}", userId);
        return bookingRepository.findByUserId(userId, pageable);
    }

    @Transactional(readOnly = true)
    public Booking getBookingById(UUID id) {
        log.info("Fetching booking by ID: {}", id);
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public Page<Booking> getBookingsByHostId(UUID hostId, Pageable pageable) {
        log.info("Fetching bookings for host ID: {}", hostId);
        return bookingRepository.findBookingsByHostId(hostId, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Booking> getAllBookings(String email, String status, Pageable pageable) {
        log.info("Fetching all bookings (admin view)");
        Specification<Booking> spec = Specification.where(BookingSpecification.hasCustomerEmail(email))
                .and(BookingSpecification.hasStatus(status));
        return bookingRepository.findAll(spec, pageable);
    }

    /**
     * Secures multi-tenant verification within a safe transactional boundary.
     */
    @Transactional(readOnly = true)
    public void verifyBookingAccess(Booking booking, UUID authenticatedUserId, Role userRole) {
        boolean isOwner = booking.getUser().getId().equals(authenticatedUserId);
        boolean isAdmin = userRole == Role.ADMIN;

        if (userRole == Role.HOST) {
            boolean isHost = booking.getTickets().stream()
                    .anyMatch(t -> t.getEventInventory().getEvent().getHost().getId().equals(authenticatedUserId));
            if (!isHost) {
                throw new AccessDeniedException("You are not authorized to view this booking.");
            }
        } else {
            if (!isOwner && !isAdmin) {
                throw new AccessDeniedException("You are not authorized to view this booking.");
            }
        }
    }
}