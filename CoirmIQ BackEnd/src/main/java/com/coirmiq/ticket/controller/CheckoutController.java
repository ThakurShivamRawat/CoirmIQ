package com.coirmiq.ticket.controller;

import com.coirmiq.ticket.domain.entity.Booking;
import com.coirmiq.ticket.dto.BookingDTO;
import com.coirmiq.ticket.dto.BookingRequest;
import com.coirmiq.ticket.dto.response.ApiResponse;
import com.coirmiq.ticket.mapper.BookingMapper;
import com.coirmiq.ticket.security.CustomUserDetails;
import com.coirmiq.ticket.service.CheckoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;
    private final BookingMapper bookingMapper;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<BookingDTO>> checkout(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody BookingRequest request
    ) {
        log.info("Received checkout request from user: {}", userDetails.getUsername());
        Booking booking = checkoutService.processCheckout(
                userDetails.getId(),
                request.getEventInventoryId(),
                request.getSeatNumbers()
        );
        BookingDTO response = bookingMapper.toDto(booking);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Booking confirmed successfully"));
    }
}
