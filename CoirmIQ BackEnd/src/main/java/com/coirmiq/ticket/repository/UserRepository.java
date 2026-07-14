package com.coirmiq.ticket.repository;

import com.coirmiq.ticket.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.coirmiq.ticket.domain.entity.Role;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmailAndRole(String email, Role role);
    boolean existsByEmailAndRole(String email, Role role);
    boolean existsByMobNoAndRole(String mobNo, Role role);
    boolean existsByUsernameAndRole(String username, Role role);
}
