package com.coirmiq.ticket.service;

import com.coirmiq.ticket.domain.entity.User;
import com.coirmiq.ticket.dto.AuthResponse;
import com.coirmiq.ticket.dto.UserDTO;
import com.coirmiq.ticket.dto.UserLoginRequest;
import com.coirmiq.ticket.dto.UserRegisterRequest;
import com.coirmiq.ticket.mapper.UserMapper;
import com.coirmiq.ticket.repository.UserRepository;
import com.coirmiq.ticket.security.CustomUserDetails;
import com.coirmiq.ticket.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(UserRegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());

        if (userRepository.existsByEmailAndRole(request.getEmail(), request.getRole())) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        if (request.getMobNo() != null && userRepository.existsByMobNoAndRole(request.getMobNo(), request.getRole())) {
            throw new IllegalArgumentException("An account with this mobile number is already registered for this role category.");
        }

        if (userRepository.existsByUsernameAndRole(request.getUsername(), request.getRole())) {
            throw new IllegalArgumentException("Username is already taken.");
        }

        User user = userMapper.toEntity(request);
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        User savedUser = userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        String token = jwtService.generateToken(userDetails);

        UserDTO userDTO = userMapper.toDto(savedUser);
        return AuthResponse.builder()
                .token(token)
                .user(userDTO)
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(UserLoginRequest request) {
        log.info("Authenticating user with email: {}", request.getEmail());

        String compositeKey = request.getEmail() + ":" + request.getRole().name();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(compositeKey, request.getPassword())
        );

        User user = userRepository.findByEmailAndRole(request.getEmail(), request.getRole())
                .orElseThrow(() -> new IllegalArgumentException("User not found after successful authentication."));

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);

        UserDTO userDTO = userMapper.toDto(user);
        return AuthResponse.builder()
                .token(token)
                .user(userDTO)
                .build();
    }
}
