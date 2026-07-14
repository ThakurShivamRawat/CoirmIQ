package com.coirmiq.ticket.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequest {

    @NotNull(message = "Event inventory ID is required")
    private UUID eventInventoryId;

    @NotEmpty(message = "At least one seat must be selected")
    private List<String> seatNumbers;
}
