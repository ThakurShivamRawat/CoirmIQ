package com.coirmiq.ticket.controller;

import com.coirmiq.ticket.domain.entity.EventInventory;
import com.coirmiq.ticket.dto.EventInventoryDTO;
import com.coirmiq.ticket.dto.EventInventoryRequest;
import com.coirmiq.ticket.dto.response.ApiResponse;
import com.coirmiq.ticket.mapper.EventInventoryMapper;
import com.coirmiq.ticket.service.EventInventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.coirmiq.ticket.security.CustomUserDetails;

@Slf4j
@RestController
@RequiredArgsConstructor
public class EventInventoryController {

    private final EventInventoryService eventInventoryService;
    private final EventInventoryMapper eventInventoryMapper;

    @GetMapping("/api/v1/events/{eventId}/inventory")
    public ResponseEntity<ApiResponse<List<EventInventoryDTO>>> getInventoryByEventId(@PathVariable UUID eventId) {
        log.info("Request received to fetch inventory for event ID: {}", eventId);
        List<EventInventoryDTO> inventoryList = eventInventoryService.getInventoryByEventId(eventId).stream()
                .map(eventInventoryMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(inventoryList, "Event inventory fetched successfully"));
    }

    @PostMapping("/api/v1/inventory")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<ApiResponse<EventInventoryDTO>> createInventory(
            @Valid @RequestBody EventInventoryRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.info("Request received to allocate inventory for event ID: {} and row ID: {}", 
                request.getEventId(), request.getRowId());
        EventInventory created = eventInventoryService.createInventory(request, userDetails.getUser());
        EventInventoryDTO dto = eventInventoryMapper.toDto(created);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "Event inventory allocated successfully"));
    }
}
