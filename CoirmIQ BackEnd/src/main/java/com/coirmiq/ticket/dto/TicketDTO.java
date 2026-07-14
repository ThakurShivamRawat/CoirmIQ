package com.coirmiq.ticket.dto;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketDTO {
    private UUID id;
    private UUID bookingId;
    private EventInventoryDTO eventInventory;
    private String seatNumber;
}
