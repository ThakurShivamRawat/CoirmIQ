package com.coirmiq.ticket.dto;

import com.coirmiq.ticket.domain.entity.BookingStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDTO {
    private UUID id;
    private UserDTO user;
    private LocalDateTime bookingTime;
    private BigDecimal totalAmount;
    private BookingStatus status;
    private List<TicketDTO> tickets;
}
