package com.coirmiq.ticket.specification;

import com.coirmiq.ticket.domain.entity.Booking;
import com.coirmiq.ticket.domain.entity.BookingStatus;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public class BookingSpecification {

    public static Specification<Booking> hasCustomerEmail(String email) {
        if (email == null || email.isEmpty()) {
            return null;
        }
        return (root, query, cb) -> cb.like(
                cb.lower(root.join("user", JoinType.LEFT).get("email")),
                "%" + email.toLowerCase() + "%"
        );
    }

    public static Specification<Booking> hasStatus(String status) {
        if (status == null || status.isEmpty()) {
            return null;
        }
        try {
            BookingStatus bookingStatus = BookingStatus.valueOf(status);
            return (root, query, cb) -> cb.equal(root.get("status"), bookingStatus);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}