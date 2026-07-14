package com.coirmiq.ticket.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(
    name = "users",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_email_role", columnNames = {"email", "role"}),
        @UniqueConstraint(name = "uq_username_role", columnNames = {"username", "role"})
    },
    indexes = {
        @Index(name = "idx_user_email_role", columnList = "email, role")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "mob_no")
    private String mobNo;

    @Column(name = "city")
    private String city;

    @Column(name = "username", nullable = false)
    private String username;
}
