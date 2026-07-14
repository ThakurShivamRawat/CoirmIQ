package com.coirmiq.ticket.repository;

import com.coirmiq.ticket.domain.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VenueRepository extends JpaRepository<Venue, UUID>, org.springframework.data.jpa.repository.JpaSpecificationExecutor<Venue> {
    Page<Venue> findByHostId(UUID hostId, Pageable pageable);

    @Query("SELECT DISTINCT v FROM Venue v LEFT JOIN FETCH v.sections s LEFT JOIN FETCH s.rows WHERE v.id = :venueId")
    Optional<Venue> findHierarchyById(@Param("venueId") UUID venueId);
}
