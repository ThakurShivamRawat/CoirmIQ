package com.coirmiq.ticket.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventInventoryDTO {
    private UUID id;
    private EventDTO event;
    private RowDTO row;
    private Integer availableSeats;
    private BigDecimal price;
}
