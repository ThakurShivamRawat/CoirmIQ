package com.coirmiq.ticket.dto;

import lombok.*;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SectionDTO {
    private UUID id;
    private String sectionName;
    private List<RowDTO> rows;
}
