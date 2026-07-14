package com.coirmiq.ticket.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SectionRequest {
    @NotBlank(message = "Section name is required")
    private String sectionName;
}
