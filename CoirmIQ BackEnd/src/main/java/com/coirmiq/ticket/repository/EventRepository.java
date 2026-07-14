package com.coirmiq.ticket.repository;

import com.coirmiq.ticket.domain.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID>, org.springframework.data.jpa.repository.JpaSpecificationExecutor<Event> {
    
    @Query("SELECT COUNT(e) > 0 FROM Event e WHERE e.venue.id = :venueId AND e.startTime < :endTime AND e.endTime > :startTime AND (:excludeEventId IS NULL OR e.id != :excludeEventId)")
    boolean hasOverlappingEvents(@Param("venueId") UUID venueId, @Param("startTime") java.time.LocalDateTime startTime, @Param("endTime") java.time.LocalDateTime endTime, @Param("excludeEventId") UUID excludeEventId);
    
    @Override
    @EntityGraph(attributePaths = {"venue", "category", "host"})
    List<Event> findAll();

    @Override
    @EntityGraph(attributePaths = {"venue", "category", "host"})
    Page<Event> findAll(Specification<Event> spec, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"venue", "category", "host"})
    Optional<Event> findById(UUID id);

    List<Event> findByHostId(UUID hostId);
    List<Event> findByVenueId(UUID venueId);
}
