package com.coirmiq.ticket.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventInventoryRequest {

    @NotNull(message = "Event ID is required")
    private UUID eventId;

    @NotNull(message = "Row ID is required")
    private UUID rowId;

    @NotNull(message = "Available seats count is required")
    @Min(value = 0, message = "Available seats count cannot be negative")
    private Integer availableSeats;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price cannot be negative")
    private BigDecimal price;
}
