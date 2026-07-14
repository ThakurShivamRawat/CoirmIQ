package com.coirmiq.ticket.repository;

import com.coirmiq.ticket.domain.entity.EventInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventInventoryRepository extends JpaRepository<EventInventory, UUID> {
    List<EventInventory> findByEventId(UUID eventId);
    Optional<EventInventory> findByEventIdAndRowId(UUID eventId, UUID rowId);
}
