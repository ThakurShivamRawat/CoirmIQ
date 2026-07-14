package com.coirmiq.ticket.controller;

import com.coirmiq.ticket.domain.entity.Row;
import com.coirmiq.ticket.domain.entity.Section;
import com.coirmiq.ticket.dto.RowDTO;
import com.coirmiq.ticket.dto.RowRequest;
import com.coirmiq.ticket.dto.SectionDTO;
import com.coirmiq.ticket.dto.SectionRequest;
import com.coirmiq.ticket.dto.response.ApiResponse;
import com.coirmiq.ticket.mapper.RowMapper;
import com.coirmiq.ticket.mapper.SectionMapper;
import com.coirmiq.ticket.security.CustomUserDetails;
import com.coirmiq.ticket.service.VenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/venues/{venueId}/layout")
@RequiredArgsConstructor
public class VenueLayoutController {

    private final VenueService venueService;
    private final SectionMapper sectionMapper;
    private final RowMapper rowMapper;

    @PostMapping("/sections")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<ApiResponse<SectionDTO>> addSection(
            @PathVariable UUID venueId,
            @Valid @RequestBody SectionRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.info("Request received to add section to venue ID: {} by user: {}", venueId, userDetails.getUsername());
        Section section = venueService.addSectionToVenue(venueId, request, userDetails.getUser());
        SectionDTO dto = sectionMapper.toDto(section);
        return ResponseEntity.ok(ApiResponse.success(dto, "Section added to venue layout successfully"));
    }

    @PostMapping("/sections/{sectionId}/rows")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<ApiResponse<RowDTO>> addRow(
            @PathVariable UUID venueId,
            @PathVariable UUID sectionId,
            @Valid @RequestBody RowRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.info("Request received to add row to section ID: {} in venue ID: {} by user: {}", sectionId, venueId, userDetails.getUsername());
        Row row = venueService.addRowToSection(venueId, sectionId, request, userDetails.getUser());
        RowDTO dto = rowMapper.toDto(row);
        return ResponseEntity.ok(ApiResponse.success(dto, "Row added to section layout successfully"));
    }
}
