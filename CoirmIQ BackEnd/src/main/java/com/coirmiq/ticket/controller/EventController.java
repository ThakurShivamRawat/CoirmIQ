package com.coirmiq.ticket.controller;

import com.coirmiq.ticket.domain.entity.Event;
import com.coirmiq.ticket.domain.entity.Venue;
import com.coirmiq.ticket.dto.EventDTO;
import com.coirmiq.ticket.dto.EventRequest;
import com.coirmiq.ticket.dto.VenueDTO;
import com.coirmiq.ticket.dto.response.ApiResponse;
import com.coirmiq.ticket.mapper.EventMapper;
import com.coirmiq.ticket.mapper.VenueMapper;
import com.coirmiq.ticket.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import com.coirmiq.ticket.security.CustomUserDetails;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

        private final EventService eventService;
        private final EventMapper eventMapper;

        @GetMapping
        public ResponseEntity<ApiResponse<Page<EventDTO>>> getAllEvents(
                        @RequestParam(required = false) String name,
                        @RequestParam(required = false) String city,
                        @RequestParam(required = false) String category,
                        Pageable pageable) {
                log.info("Request received to fetch events with filters - name: {}, city: {}, category: {}, pageable: {}",
                                name, city, category, pageable);
                Page<EventDTO> events = eventService.getEvents(name, city, category, pageable)
                                .map(eventMapper::toDto);
                return ResponseEntity.ok(ApiResponse.success(events, "Events fetched successfully"));
        }

        @GetMapping("/host/me")
        @PreAuthorize("hasRole('HOST')")
        public ResponseEntity<ApiResponse<java.util.List<EventDTO>>> getMyEvents(
                        @AuthenticationPrincipal CustomUserDetails userDetails) {
                log.info("Request received to fetch events owned by host user: {}", userDetails.getUsername());
                java.util.List<EventDTO> events = eventService.getEventsByHostId(userDetails.getId()).stream()
                                .map(eventMapper::toDto)
                                .collect(Collectors.toList());
                return ResponseEntity.ok(ApiResponse.success(events, "Host events fetched successfully"));
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<EventDTO>> getEventById(@PathVariable UUID id) {
                log.info("Request received to fetch event with ID: {}", id);
                EventDTO event = eventMapper.toDto(eventService.getEventById(id));
                return ResponseEntity.ok(ApiResponse.success(event, "Event fetched successfully"));
        }

        @PostMapping
        @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
        public ResponseEntity<ApiResponse<EventDTO>> createEvent(
                        @Valid @RequestBody EventRequest request,
                        @AuthenticationPrincipal CustomUserDetails userDetails) {
                log.info("Request received to create event: {}", request.getName());
                Event created = eventService.createEvent(request, userDetails.getUser());
                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(ApiResponse.success(eventMapper.toDto(created), "Event created successfully"));
        }

        @PutMapping("/{id}")
        @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
        public ResponseEntity<ApiResponse<EventDTO>> updateEvent(
                        @PathVariable UUID id,
                        @Valid @RequestBody EventRequest request,
                        @AuthenticationPrincipal CustomUserDetails userDetails) {
                log.info("Request received to update event ID: {}", id);
                Event updated = eventService.updateEvent(id, request, userDetails.getUser());
                return ResponseEntity.ok(ApiResponse.success(eventMapper.toDto(updated), "Event updated successfully"));
        }

        @DeleteMapping("/{id}")
        @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
        public ResponseEntity<ApiResponse<Void>> deleteEvent(
                        @PathVariable UUID id,
                        @AuthenticationPrincipal CustomUserDetails userDetails) {
                log.info("Request received to delete event ID: {}", id);
                eventService.deleteEvent(id, userDetails.getUser());
                return ResponseEntity.ok(ApiResponse.success(null, "Event deleted successfully"));
        }

}
