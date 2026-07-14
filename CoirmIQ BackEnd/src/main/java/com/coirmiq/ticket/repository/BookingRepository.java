package com.coirmiq.ticket.repository;

import com.coirmiq.ticket.domain.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID>, JpaSpecificationExecutor<Booking> {
    Page<Booking> findByUserId(UUID userId, Pageable pageable);

    @EntityGraph(attributePaths = {"user", "tickets", "tickets.eventInventory.event"})
    @Query("SELECT DISTINCT b FROM Booking b JOIN b.tickets t JOIN t.eventInventory ei JOIN ei.event e WHERE e.host.id = :hostId")
    Page<Booking> findBookingsByHostId(@Param("hostId") UUID hostId, Pageable pageable);
}
