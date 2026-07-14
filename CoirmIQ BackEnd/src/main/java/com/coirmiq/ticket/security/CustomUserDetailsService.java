package com.coirmiq.ticket.security;

import com.coirmiq.ticket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.coirmiq.ticket.domain.entity.Role;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String compositeKey) throws UsernameNotFoundException {
        if (compositeKey == null || !compositeKey.contains(":")) {
             throw new UsernameNotFoundException("Invalid token identity format.");
        }
        String[] parts = compositeKey.split(":");
        return userRepository.findByEmailAndRole(parts[0], Role.valueOf(parts[1]))
                .map(CustomUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + compositeKey));
    }
}
