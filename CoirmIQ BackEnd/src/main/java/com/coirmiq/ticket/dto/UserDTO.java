package com.coirmiq.ticket.dto;

import com.coirmiq.ticket.domain.entity.Role;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private UUID id;
    private Role role;
    private String email;
    private LocalDate dob;
    private String mobNo;
    private String city;
    private String username;
}
