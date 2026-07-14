package com.coirmiq.ticket.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(
    name = "ticket",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_inventory_seat", columnNames = {"event_inventory_id", "seat_number"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_inventory_id", nullable = false)
    private EventInventory eventInventory;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber;
}
