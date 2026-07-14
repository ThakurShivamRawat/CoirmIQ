package com.coirmiq.ticket.service;

import com.coirmiq.ticket.domain.entity.Event;
import com.coirmiq.ticket.domain.entity.EventInventory;
import com.coirmiq.ticket.domain.entity.Row;
import com.coirmiq.ticket.dto.EventInventoryRequest;
import com.coirmiq.ticket.exception.ResourceNotFoundException;
import com.coirmiq.ticket.repository.EventInventoryRepository;
import com.coirmiq.ticket.repository.EventRepository;
import com.coirmiq.ticket.repository.RowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coirmiq.ticket.domain.entity.User;
import com.coirmiq.ticket.domain.entity.Role;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventInventoryService {

    private final EventInventoryRepository eventInventoryRepository;
    private final EventRepository eventRepository;
    private final RowRepository rowRepository;

    @Transactional(readOnly = true)
    public List<EventInventory> getInventoryByEventId(UUID eventId) {
        log.info("Fetching event inventory for event ID: {}", eventId);
        return eventInventoryRepository.findByEventId(eventId);
    }

    @Transactional
    public EventInventory createInventory(EventInventoryRequest request, User currentUser) {
        log.info("Creating event inventory for event ID: {} and row ID: {}", request.getEventId(), request.getRowId());

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        if (currentUser.getRole() != Role.ADMIN && !event.getHost().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to create inventory for this event.");
        }

        Row row = rowRepository.findById(request.getRowId())
                .orElseThrow(() -> new ResourceNotFoundException("Row not found with ID: " + request.getRowId()));

        if (!row.getSection().getVenue().getId().equals(event.getVenue().getId())) {
            throw new IllegalArgumentException("This row does not belong to the venue hosting this event.");
        }

        if (request.getAvailableSeats() > row.getCapacity()) {
            throw new IllegalArgumentException("Cannot allocate more seats than the row's physical capacity.");
        }

        if (eventInventoryRepository.findByEventIdAndRowId(request.getEventId(), request.getRowId()).isPresent()) {
            throw new IllegalArgumentException("This row has already been added to the event's inventory.");
        }

        EventInventory inventory = EventInventory.builder()
                .event(event)
                .row(row)
                .availableSeats(request.getAvailableSeats())
                .price(request.getPrice())
                .build();

        return eventInventoryRepository.save(inventory);
    }
}
