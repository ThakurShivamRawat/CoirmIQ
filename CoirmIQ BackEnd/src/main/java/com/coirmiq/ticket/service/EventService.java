package com.coirmiq.ticket.service;

import com.coirmiq.ticket.domain.entity.Event;
import com.coirmiq.ticket.domain.entity.EventInventory;
import com.coirmiq.ticket.domain.entity.Venue;
import com.coirmiq.ticket.exception.ResourceNotFoundException;
import com.coirmiq.ticket.repository.EventRepository;
import com.coirmiq.ticket.repository.VenueRepository;
import com.coirmiq.ticket.repository.EventInventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import com.coirmiq.ticket.specification.EventSpecification;

import org.springframework.security.access.AccessDeniedException;
import com.coirmiq.ticket.domain.entity.User;
import com.coirmiq.ticket.domain.entity.Role;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;
    private final com.coirmiq.ticket.repository.CategoryRepository categoryRepository;
    private final com.coirmiq.ticket.repository.UserRepository userRepository;
    private final EventInventoryRepository eventInventoryRepository;



    @Transactional(readOnly = true)
    public List<Event> getAllEvents() {
        log.info("Fetching all events");
        return eventRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Event> getEventsByHostId(UUID hostId) {
        log.info("Fetching events for host ID: {}", hostId);
        return eventRepository.findByHostId(hostId);
    }

    @Transactional(readOnly = true)
    public Page<Event> getEvents(String name, String city, String category, Pageable pageable) {
        log.info("Fetching paginated events with filters: name={}, city={}, category={}", name, city, category);
        Specification<Event> spec = Specification.where(null);

        if (name != null && !name.trim().isEmpty()) {
            spec = spec.and(EventSpecification.hasName(name));
        }
        if (city != null && !city.trim().isEmpty()) {
            spec = spec.and(EventSpecification.hasCity(city));
        }
        if (category != null && !category.trim().isEmpty()) {
            spec = spec.and(EventSpecification.hasCategory(category));
        }

        return eventRepository.findAll(spec, pageable);
    }

    @Transactional(readOnly = true)
    public Event getEventById(UUID id) {
        log.info("Fetching event by ID: {}", id);
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    @Transactional
    public Event createEvent(com.coirmiq.ticket.dto.EventRequest request, User currentUser) {
        log.info("Creating new event from request: {}", request.getName());
        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID: " + request.getVenueId()));
        if (currentUser.getRole() != Role.ADMIN && !venue.getHost().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You cannot host an event at a venue you do not own.");
        }
        com.coirmiq.ticket.domain.entity.Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        // Overlap validation
        java.time.LocalDateTime endTime = request.getStartTime().plusMinutes(request.getDuration());
        if (eventRepository.hasOverlappingEvents(request.getVenueId(), request.getStartTime(), endTime, null)) {
            throw new IllegalArgumentException("Venue is already booked for this time slot.");
        }

        Event event = Event.builder()
                .venue(venue)
                .category(category)
                .host(currentUser)
                .name(request.getName())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .duration(request.getDuration())
                .imageUrl(request.getImageUrl())
                .endTime(endTime)
                .build();

        return eventRepository.save(event);
    }

    @Transactional
    public Event updateEvent(UUID id, com.coirmiq.ticket.dto.EventRequest request, User currentUser) {
        log.info("Updating event with ID: {}", id);
        Event event = getEventById(id);

        if (currentUser.getRole() != Role.ADMIN && !event.getHost().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to modify this event.");
        }

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID: " + request.getVenueId()));
        if (currentUser.getRole() != Role.ADMIN && !venue.getHost().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You cannot host an event at a venue you do not own.");
        }
        com.coirmiq.ticket.domain.entity.Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        // Overlap validation
        java.time.LocalDateTime endTime = request.getStartTime().plusMinutes(request.getDuration());
        if (eventRepository.hasOverlappingEvents(request.getVenueId(), request.getStartTime(), endTime, id)) {
            throw new IllegalArgumentException("Venue is already booked for this time slot.");
        }

        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setStartTime(request.getStartTime());
        event.setDuration(request.getDuration());
        event.setVenue(venue);
        event.setCategory(category);
        event.setImageUrl(request.getImageUrl());
        event.setEndTime(endTime);

        return eventRepository.save(event);
    }

    @Transactional
    public void deleteEvent(UUID id, User currentUser) {
        log.info("Deleting event with ID: {}", id);
        Event event = getEventById(id);

        if (currentUser.getRole() != Role.ADMIN && !event.getHost().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to delete this event.");
        }

        List<EventInventory> inventories = eventInventoryRepository.findByEventId(id);
        boolean hasBookings = inventories.stream()
                .anyMatch(inv -> inv.getAvailableSeats() < inv.getRow().getCapacity());

        if (hasBookings) {
            throw new IllegalStateException("Cannot delete an event that already has initialized inventory or sold tickets. Please cancel the event instead.");
        }

        if (!inventories.isEmpty()) {
            eventInventoryRepository.deleteAll(inventories);
        }

        eventRepository.delete(event);
    }
}
