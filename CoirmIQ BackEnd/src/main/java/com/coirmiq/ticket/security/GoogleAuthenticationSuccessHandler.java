package com.coirmiq.ticket.security;

import com.coirmiq.ticket.domain.entity.Role;
import com.coirmiq.ticket.domain.entity.User;
import com.coirmiq.ticket.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
public class GoogleAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final HandlerExceptionResolver resolver;

    @Value("${app.oauth2.redirect-uri:http://localhost:3000/oauth2/redirect}")
    private String redirectUri;

    public GoogleAuthenticationSuccessHandler(
            UserRepository userRepository,
            @Lazy PasswordEncoder passwordEncoder,
            JwtService jwtService,
            @Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.resolver = resolver;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        try {
            log.info("Google OAuth2 authentication succeeded. Initiating user synchronization/registration.");

            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String email = oAuth2User.getAttribute("email");

            if (email == null || email.trim().isEmpty()) {
                throw new IllegalArgumentException("Email attribute is missing from Google OAuth2 provider");
            }

            if (userRepository.existsByEmailAndRole(email, Role.HOST) || userRepository.existsByEmailAndRole(email, Role.ADMIN)) {
                throw new AccessDeniedException("OAuth2 login is strictly restricted to regular customer accounts. Please use standard credential authentication.");
            }

            User user = userRepository.findByEmailAndRole(email, Role.USER).orElseGet(() -> {
                log.info("User with email {} not found. Creating a new account with USER role.", email);
                String usernamePrefix = email.split("@")[0];
                String generatedUsername = usernamePrefix + "_" + UUID.randomUUID().toString().substring(0, 4);
                User newUser = User.builder()
                        .email(email)
                        .username(generatedUsername)
                        .role(Role.USER)
                        .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .build();
                return userRepository.save(newUser);
            });

            CustomUserDetails userDetails = new CustomUserDetails(user);
            
            // 🛠️ FIX 1: Populate Extra Claims with real DB data for JWT Payload integration
            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("username", user.getUsername());
            extraClaims.put("email", user.getEmail());
            extraClaims.put("city", user.getCity() != null ? user.getCity() : "Gwalioer");

            // Generate token passing the claims map instead of an empty hash payload
            String token = jwtService.generateToken(extraClaims, userDetails);

            log.info("Successfully generated enriched JWT for user {}. Redirecting to frontend redirect URL.", email);

            // 🛠️ FIX 2: Append plain query text params safely to sync fallback parsing engines
            String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                    .queryParam("token", token)
                    .queryParam("username", user.getUsername())
                    .queryParam("email", user.getEmail())
                    .build().toUriString();

            response.sendRedirect(targetUrl);
        } catch (Exception ex) {
            log.error("Error processing OAuth2 success handler, delegating to resolver", ex);
            resolver.resolveException(request, response, null, ex);
        }
    }
}