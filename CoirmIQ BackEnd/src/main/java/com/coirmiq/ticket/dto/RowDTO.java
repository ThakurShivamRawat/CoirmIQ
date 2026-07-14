package com.coirmiq.ticket.dto;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RowDTO {
    private UUID id;
    private String rowName;
    private Integer capacity;
}
