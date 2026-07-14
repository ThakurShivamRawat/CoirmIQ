package com.coirmiq.ticket.dto;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueSummaryDTO {
    private UUID id;
    private HostProfileDTO host;
    private String name;
    private String address;
    private String buildingNumber;
    private String city;
    private String pincode;
    private String landmark;
}
