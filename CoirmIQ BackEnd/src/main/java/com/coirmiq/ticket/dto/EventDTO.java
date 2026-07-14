package com.coirmiq.ticket.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDTO {
    private UUID id;
    private VenueSummaryDTO venue;
    private CategoryDTO category;
    private HostProfileDTO host;
    private String name;
    private String description;
    private LocalDateTime startTime;
    private Integer duration;
    private String imageUrl;
    private LocalDateTime endTime;
}
