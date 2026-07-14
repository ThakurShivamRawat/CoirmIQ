package com.coirmiq.ticket.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "venue")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private User host;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "building_number", nullable = false)
    private String buildingNumber;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "pincode", nullable = false)
    private String pincode;

    @Column(name = "landmark", nullable = false)
    private String landmark;

    @Builder.Default
    @OneToMany(mappedBy = "venue", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.Set<Section> sections = new java.util.LinkedHashSet<>();

    public void addSection(Section section) {
        if (section != null) {
            this.sections.add(section);
            section.setVenue(this);
        }
    }
}