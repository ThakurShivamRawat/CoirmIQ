package com.coirmiq.ticket.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(
    name = "section",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_venue_section", columnNames = {"venue_id", "section_name"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @Column(name = "section_name", nullable = false)
    private String sectionName;

    @Builder.Default
    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.Set<Row> rows = new java.util.LinkedHashSet<>();

    public void addRow(Row row) {
        if (row != null) {
            this.rows.add(row);
            row.setSection(this);
        }
    }
}
