package com.coirmiq.ticket.service;

import com.coirmiq.ticket.domain.entity.*;
import com.coirmiq.ticket.exception.ResourceNotFoundException;
import com.coirmiq.ticket.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private VenueRepository venueRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EventInventoryRepository eventInventoryRepository;

    @InjectMocks
    private EventService eventService;

    private User hostUser;
    private User adminUser;
    private User otherUser;
    private Event event;
    private UUID eventId;

    @BeforeEach
    void setUp() {
        eventId = UUID.randomUUID();
        hostUser = User.builder()
                .id(UUID.randomUUID())
                .email("host@example.com")
                .role(Role.HOST)
                .build();

        adminUser = User.builder()
                .id(UUID.randomUUID())
                .email("admin@example.com")
                .role(Role.ADMIN)
                .build();

        otherUser = User.builder()
                .id(UUID.randomUUID())
                .email("other@example.com")
                .role(Role.HOST)
                .build();

        event = Event.builder()
                .id(eventId)
                .name("Test Event")
                .host(hostUser)
                .build();
    }

    @Test
    void testDeleteEvent_AsAdmin_NoInventory() {
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(eventInventoryRepository.findByEventId(eventId)).thenReturn(Collections.emptyList());

        assertDoesNotThrow(() -> eventService.deleteEvent(eventId, adminUser));

        verify(eventInventoryRepository, never()).deleteAll(anyList());
        verify(eventRepository, times(1)).delete(event);
    }

    @Test
    void testDeleteEvent_AsHost_NoInventory() {
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(eventInventoryRepository.findByEventId(eventId)).thenReturn(Collections.emptyList());

        assertDoesNotThrow(() -> eventService.deleteEvent(eventId, hostUser));

        verify(eventInventoryRepository, never()).deleteAll(anyList());
        verify(eventRepository, times(1)).delete(event);
    }

    @Test
    void testDeleteEvent_UnauthorizedUser_ThrowsAccessDeniedException() {
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));

        assertThrows(AccessDeniedException.class, () -> eventService.deleteEvent(eventId, otherUser));

        verify(eventInventoryRepository, never()).findByEventId(any(UUID.class));
        verify(eventRepository, never()).delete(any(Event.class));
    }

    @Test
    void testDeleteEvent_WithUnsoldInventory_SucceedsAndClearsInventory() {
        Row row = Row.builder().capacity(100).build();
        EventInventory unsoldInventory = EventInventory.builder()
                .id(UUID.randomUUID())
                .event(event)
                .row(row)
                .availableSeats(100) // All seats available (unsold)
                .price(BigDecimal.valueOf(50.00))
                .build();

        List<EventInventory> inventories = new ArrayList<>();
        inventories.add(unsoldInventory);

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(eventInventoryRepository.findByEventId(eventId)).thenReturn(inventories);

        assertDoesNotThrow(() -> eventService.deleteEvent(eventId, hostUser));

        verify(eventInventoryRepository, times(1)).deleteAll(inventories);
        verify(eventRepository, times(1)).delete(event);
    }

    @Test
    void testDeleteEvent_WithSoldInventory_ThrowsIllegalStateException() {
        Row row = Row.builder().capacity(100).build();
        EventInventory soldInventory = EventInventory.builder()
                .id(UUID.randomUUID())
                .event(event)
                .row(row)
                .availableSeats(99) // 1 ticket sold (available seats < capacity)
                .price(BigDecimal.valueOf(50.00))
                .build();

        List<EventInventory> inventories = new ArrayList<>();
        inventories.add(soldInventory);

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(eventInventoryRepository.findByEventId(eventId)).thenReturn(inventories);

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> eventService.deleteEvent(eventId, hostUser));
        assertTrue(exception.getMessage().contains("Cannot delete an event that already has initialized inventory or sold tickets"));

        verify(eventInventoryRepository, never()).deleteAll(anyList());
        verify(eventRepository, never()).delete(any(Event.class));
    }
}
