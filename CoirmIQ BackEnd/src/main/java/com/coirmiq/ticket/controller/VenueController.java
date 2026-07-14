package com.coirmiq.ticket.controller;

import com.coirmiq.ticket.domain.entity.Venue;
import com.coirmiq.ticket.dto.VenueDTO;
import com.coirmiq.ticket.dto.VenueSummaryDTO;
import com.coirmiq.ticket.dto.VenueRequest;
import com.coirmiq.ticket.dto.response.ApiResponse;
import com.coirmiq.ticket.mapper.VenueMapper;
import com.coirmiq.ticket.service.EventService;
import com.coirmiq.ticket.service.VenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.coirmiq.ticket.security.CustomUserDetails;

@Slf4j
@RestController
@RequestMapping("/api/v1/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;
    private final VenueMapper venueMapper;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // Restrict flat database dumps to system administrators
    public ResponseEntity<ApiResponse<Page<VenueSummaryDTO>>> getAllVenues(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String city,
            Pageable pageable
    ) {
        log.info("Request received to fetch all venues for admin audit");
        Page<VenueSummaryDTO> venues = venueService.getAllVenues(name, city, pageable)
                .map(venueMapper::toSummaryDto);
        return ResponseEntity.ok(ApiResponse.success(venues, "All venues fetched successfully"));
    }

    @GetMapping("/host/me")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<ApiResponse<Page<VenueSummaryDTO>>> getMyVenues(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            Pageable pageable) {
        log.info("Request received to fetch venues owned by host user: {}", userDetails.getUsername());
        Page<VenueSummaryDTO> venues = venueService.getVenuesByHostId(userDetails.getId(), pageable)
                .map(venueMapper::toSummaryDto);
        return ResponseEntity.ok(ApiResponse.success(venues, "Host venues fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VenueDTO>> getVenueById(@PathVariable UUID id) {
        log.info("Request received to fetch venue by ID: {}", id);
        VenueDTO venue = venueMapper.toDto(venueService.getVenueById(id));
        return ResponseEntity.ok(ApiResponse.success(venue, "Venue fetched successfully"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<ApiResponse<VenueDTO>> createVenue(
            @Valid @RequestBody VenueRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        log.info("Request received to create venue: {}", request.getName());
        Venue created = venueService.createVenue(request, userDetails.getUser());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(venueMapper.toDto(created), "Venue created successfully"));
    }

    @GetMapping("/{id}/hierarchy")
    public ResponseEntity<ApiResponse<VenueDTO>> getVenueHierarchy(@PathVariable UUID id) {
        log.info("Request received to fetch hierarchical layout for venue ID: {}", id);
        
        // CALL VenueService directly instead of EventService
        Venue venue = venueService.getVenueHierarchy(id); 
        VenueDTO hierarchy = venueMapper.toDto(venue);
        return ResponseEntity.ok(ApiResponse.success(hierarchy, "Venue hierarchy fetched successfully"));
    }
}
