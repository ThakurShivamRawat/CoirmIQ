package com.coirmiq.ticket.controller;

import com.coirmiq.ticket.domain.entity.Booking;
import com.coirmiq.ticket.dto.BookingDTO;
import com.coirmiq.ticket.dto.response.ApiResponse;
import com.coirmiq.ticket.mapper.BookingMapper;
import com.coirmiq.ticket.security.CustomUserDetails;
import com.coirmiq.ticket.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final BookingMapper bookingMapper;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Page<BookingDTO>>> getMyBookings(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            Pageable pageable
    ) {
        log.info("Request received to fetch bookings for authenticated user: {}", userDetails.getUsername());
        Page<BookingDTO> bookings = bookingService.getBookingsByUserId(userDetails.getId(), pageable)
                .map(bookingMapper::toDto);
        return ResponseEntity.ok(ApiResponse.success(bookings, "User bookings fetched successfully"));
    }

    @GetMapping("/host/sales")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<ApiResponse<Page<BookingDTO>>> getHostSales(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            Pageable pageable
    ) {
        log.info("Request received to fetch sales bookings for host user: {}", userDetails.getUsername());
        Page<BookingDTO> bookings = bookingService.getBookingsByHostId(userDetails.getId(), pageable)
                .map(bookingMapper::toDto);
        return ResponseEntity.ok(ApiResponse.success(bookings, "Host sales fetched successfully"));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<BookingDTO>>> getAllBookings(
            @RequestParam(required = false) String customerEmail,
            @RequestParam(required = false) String status,
            Pageable pageable
    ) {
        log.info("Request received to fetch all bookings for admin view");
        Page<BookingDTO> bookings = bookingService.getAllBookings(customerEmail, status, pageable)
                .map(bookingMapper::toDto);
        return ResponseEntity.ok(ApiResponse.success(bookings, "All bookings fetched successfully"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BookingDTO>> getBookingById(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.info("Request received to fetch booking: {} for user: {}", id, userDetails.getUsername());
        
        // 1. Fetch entity
        Booking booking = bookingService.getBookingById(id);

        // 2. Perform deep relational multi-tenant checks securely inside the open session boundary
        bookingService.verifyBookingAccess(booking, userDetails.getId(), userDetails.getUser().getRole());

        // 3. Transform and map cleanly to data contract
        BookingDTO response = bookingMapper.toDto(booking);
        return ResponseEntity.ok(ApiResponse.success(response, "Booking details fetched successfully"));
    }
}