package com.coirmiq.ticket.repository;

import com.coirmiq.ticket.domain.entity.Row;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface RowRepository extends JpaRepository<Row, UUID> {
    List<Row> findBySectionId(UUID sectionId);
}
