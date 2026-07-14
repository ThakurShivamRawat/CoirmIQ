package com.coirmiq.ticket.dto;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HostProfileDTO {
    private UUID id;
    private String username;
}
