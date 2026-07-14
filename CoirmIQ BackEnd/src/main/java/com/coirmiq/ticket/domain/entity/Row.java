package com.coirmiq.ticket.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(
    name = "venue_row",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_section_row", columnNames = {"section_id", "row_name"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Row {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;

    @Column(name = "row_name", nullable = false)
    private String rowName;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;
}
