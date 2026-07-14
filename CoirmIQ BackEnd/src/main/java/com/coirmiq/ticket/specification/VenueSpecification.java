package com.coirmiq.ticket.specification;

import com.coirmiq.ticket.domain.entity.Venue;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class VenueSpecification {

    public static Specification<Venue> withFilters(String name, String city, String pincode, String address) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (name != null && !name.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.trim().toLowerCase() + "%"));
            }
            if (city != null && !city.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("city")), "%" + city.trim().toLowerCase() + "%"));
            }
            if (pincode != null && !pincode.trim().isEmpty()) {
                predicates.add(cb.equal(root.get("pincode"), pincode.trim()));
            }
            if (address != null && !address.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("address")), "%" + address.trim().toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}