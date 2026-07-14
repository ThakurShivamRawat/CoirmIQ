package com.coirmiq.ticket.specification;

import com.coirmiq.ticket.domain.entity.Event;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;
import java.util.UUID;

public class EventSpecification {

    public static Specification<Event> hasName(String name) {
        return (root, query, cb) -> {
            if (name == null || name.trim().isEmpty()) {
                return null;
            }
            return cb.like(cb.lower(root.get("name")), "%" + name.trim().toLowerCase() + "%");
        };
    }

    public static Specification<Event> hasCity(String city) {
        return (root, query, cb) -> {
            if (city == null || city.trim().isEmpty()) {
                return null;
            }
            return cb.like(cb.lower(root.join("venue", JoinType.LEFT).get("city")), "%" + city.trim().toLowerCase() + "%");
        };
    }

    public static Specification<Event> hasCategory(String category) {
        return (root, query, cb) -> {
            if (category == null || category.trim().isEmpty()) {
                return null;
            }
            try {
                UUID id = UUID.fromString(category.trim());
                return cb.equal(root.join("category", JoinType.LEFT).get("id"), id);
            } catch (IllegalArgumentException e) {
                return cb.like(cb.lower(root.join("category", JoinType.LEFT).get("name")), "%" + category.trim().toLowerCase() + "%");
            }
        };
    }
}
