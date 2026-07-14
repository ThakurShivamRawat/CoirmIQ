package com.coirmiq.ticket.dto;

import com.coirmiq.ticket.domain.entity.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.AssertTrue;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    private LocalDate dob;

    private String mobNo;

    private String city;

    @JsonIgnore
    @AssertTrue(message = "Registration as an ADMIN is strictly prohibited.")
    public boolean isValidRoleSelection() {
        if (this.role == null) {
            return true; // Let the @NotNull annotation handle the empty field error instead
        }
        return this.role != Role.ADMIN;
    }
}