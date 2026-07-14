package com.coirmiq.ticket.service;

import com.coirmiq.ticket.domain.entity.*;
import com.coirmiq.ticket.exception.PaymentFailedException;
import com.coirmiq.ticket.exception.SeatAlreadyLockedException;
import com.coirmiq.ticket.repository.BookingRepository;
import com.coirmiq.ticket.repository.EventInventoryRepository;
import com.coirmiq.ticket.repository.TicketRepository;
import com.coirmiq.ticket.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.orm.ObjectOptimisticLockingFailureException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CheckoutServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private EventInventoryRepository eventInventoryRepository;

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MockPaymentService mockPaymentService;

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private CheckoutService checkoutService;

    private CheckoutService spySelf;

    private User user;
    private EventInventory inventory;
    private Booking booking;

    @BeforeEach
    void setUp() {
        spySelf = spy(checkoutService);
        try {
            java.lang.reflect.Field selfField = CheckoutService.class.getDeclaredField("self");
            selfField.setAccessible(true);
            selfField.set(checkoutService, spySelf);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        user = User.builder()
                .id(UUID.randomUUID())
                .email("user@example.com")
                .role(Role.USER)
                .build();

        Event event = Event.builder().id(UUID.randomUUID()).name("Rock Concert").build();
        Row row = Row.builder().id(UUID.randomUUID()).rowName("Row A").capacity(50).build();

        inventory = EventInventory.builder()
                .id(UUID.randomUUID())
                .event(event)
                .row(row)
                .availableSeats(10)
                .price(BigDecimal.valueOf(100.00))
                .version(1L)
                .build();

        booking = Booking.builder()
                .id(UUID.randomUUID())
                .user(user)
                .bookingTime(LocalDateTime.now())
                .totalAmount(BigDecimal.valueOf(200.00))
                .status(BookingStatus.PENDING)
                .build();

        lenient().when(bookingRepository.findById(any(UUID.class))).thenReturn(Optional.of(booking));
    }

    @Test
    void testSuccessfulCheckout() {
        List<String> seats = Arrays.asList("A1", "A2");

        // Mock database resolutions
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(eventInventoryRepository.findById(inventory.getId())).thenReturn(Optional.of(inventory));
        
        // Mock step 1: create pending booking
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking b = invocation.getArgument(0);
            b.setId(booking.getId());
            return b;
        });

        // Mock step 2: Redis locks success
        when(valueOperations.setIfAbsent(anyString(), anyString(), any())).thenReturn(true);

        // Mock step 3: Payment succeeds
        when(mockPaymentService.processPayment()).thenReturn(true);

        // Mock final lookup of booking
        when(bookingRepository.findById(booking.getId())).thenReturn(Optional.of(booking));

        Booking result = checkoutService.processCheckout(user.getId(), inventory.getId(), seats);

        assertNotNull(result);
        verify(mockPaymentService, times(1)).processPayment();
        verify(eventInventoryRepository, times(1)).save(inventory);
        verify(ticketRepository, never()).save(any(Ticket.class));
        verify(bookingRepository, atLeastOnce()).save(any(Booking.class));
        assertEquals(8, inventory.getAvailableSeats()); // Decremented by 2
    }

    @Test
    void testCheckoutThrowsSeatAlreadyLockedException() {
        List<String> seats = Arrays.asList("A1", "A2");

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(eventInventoryRepository.findById(inventory.getId())).thenReturn(Optional.of(inventory));
        
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking b = invocation.getArgument(0);
            b.setId(booking.getId());
            return b;
        });

        // First seat succeeds, second seat fails to lock
        when(valueOperations.setIfAbsent(anyString(), anyString(), any())).thenReturn(true, false);

        assertThrows(SeatAlreadyLockedException.class, () -> 
            checkoutService.processCheckout(user.getId(), inventory.getId(), seats)
        );

        // Verify rollback of the first locked seat was executed
        verify(redisTemplate, atLeastOnce()).delete(anyString());
        // Verify booking status marked as FAILED
        verify(bookingRepository, atLeastOnce()).save(argThat(b -> b.getStatus() == BookingStatus.FAILED));
    }

    @Test
    void testCheckoutRollsBackRedisLocksWhenPaymentFails() {
        List<String> seats = Arrays.asList("A1", "A2");

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(eventInventoryRepository.findById(inventory.getId())).thenReturn(Optional.of(inventory));
        
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking b = invocation.getArgument(0);
            b.setId(booking.getId());
            return b;
        });

        // Redis locks succeeded
        when(valueOperations.setIfAbsent(anyString(), anyString(), any())).thenReturn(true);

        // Payment failed
        when(mockPaymentService.processPayment()).thenReturn(false);

        assertThrows(PaymentFailedException.class, () -> 
            checkoutService.processCheckout(user.getId(), inventory.getId(), seats)
        );

        // Verify Redis locks released
        verify(redisTemplate, atLeastOnce()).delete(anyString());
        // Verify booking status set to FAILED
        verify(bookingRepository, atLeastOnce()).save(argThat(b -> b.getStatus() == BookingStatus.FAILED));
    }

    @Test
    void testCheckoutRollsBackRedisLocksWhenOptimisticLockingFails() {
        List<String> seats = Arrays.asList("A1", "A2");

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(eventInventoryRepository.findById(inventory.getId())).thenReturn(Optional.of(inventory));
        
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking b = invocation.getArgument(0);
            b.setId(booking.getId());
            return b;
        });

        when(valueOperations.setIfAbsent(anyString(), anyString(), any())).thenReturn(true);

        when(mockPaymentService.processPayment()).thenReturn(true);

        // Throw optimistic locking exception on inventory update
        when(eventInventoryRepository.save(any(EventInventory.class)))
                .thenThrow(new ObjectOptimisticLockingFailureException(EventInventory.class, inventory.getId()));

        assertThrows(SeatAlreadyLockedException.class, () -> 
            checkoutService.processCheckout(user.getId(), inventory.getId(), seats)
        );

        // Verify Redis locks released
        verify(redisTemplate, atLeastOnce()).delete(anyString());
        // Verify booking status set to FAILED
        verify(bookingRepository, atLeastOnce()).save(argThat(b -> b.getStatus() == BookingStatus.FAILED));
    }

    @Test
    void testCheckoutRefundsOnDataIntegrityViolation() {
        List<String> seats = Arrays.asList("A1", "A2");

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(eventInventoryRepository.findById(inventory.getId())).thenReturn(Optional.of(inventory));
        
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking b = invocation.getArgument(0);
            b.setId(booking.getId());
            return b;
        });

        // Mock Redis locks success
        when(valueOperations.setIfAbsent(anyString(), anyString(), any())).thenReturn(true);

        // Throw DataIntegrityViolationException when self.confirmBooking is called
        doThrow(new org.springframework.dao.DataIntegrityViolationException("Unique constraint violation"))
                .when(spySelf).confirmBooking(any(UUID.class), any(UUID.class), anyList());

        assertThrows(SeatAlreadyLockedException.class, () -> 
            checkoutService.processCheckout(user.getId(), inventory.getId(), seats)
        );

        // Verify refund payment was called exactly 1 time
        verify(mockPaymentService, times(1)).refundPayment();

        // Verify Redis locks released
        verify(redisTemplate, atLeastOnce()).delete(anyString());
        // Verify booking status set to FAILED
        verify(bookingRepository, atLeastOnce()).save(argThat(b -> b.getStatus() == BookingStatus.FAILED));
    }
}
