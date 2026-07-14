package com.coirmiq.ticket.config;

import com.coirmiq.ticket.security.JwtAuthenticationFilter;
import com.coirmiq.ticket.security.GoogleAuthenticationSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.coirmiq.ticket.security.CustomAuthenticationEntryPoint;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;
    private final GoogleAuthenticationSuccessHandler oauth2SuccessHandler;
    private final CustomAuthenticationEntryPoint customAuthEntryPoint;

    @Bean
    @org.springframework.core.annotation.Order(1)
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/v1/**")
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(customAuthEntryPoint)
            )
            .authorizeHttpRequests(auth -> auth
                // Allow all auth endpoints
                .requestMatchers("/api/v1/auth/**").permitAll()
                
                // Protect host routes (must evaluate before public wildcards)
                .requestMatchers("/api/v1/events/host/**", "/api/v1/venues/host/**", "/api/v1/bookings/host/**").hasRole("HOST")
                
                // Allow public read access to events, venues, and categories
                .requestMatchers(HttpMethod.GET, "/api/v1/events/**", "/api/v1/venues/**", "/api/v1/categories/**").permitAll()
                
                // Restrict checkout to USER and ADMIN
                .requestMatchers("/api/v1/checkout/**").hasAnyRole("USER", "ADMIN")
                
                // Restrict inventory allocations and image signature generation to HOST and ADMIN
                .requestMatchers("/api/v1/inventory/**", "/api/v1/images/**").hasAnyRole("HOST", "ADMIN")
                
                // Everything else requires authentication
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    @org.springframework.core.annotation.Order(2)
    public SecurityFilterChain oauth2SecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oauth2SuccessHandler)
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Define your Micro-Frontend origins
        configuration.setAllowedOrigins(List.of(
            "http://localhost:3000", // Consumer App (USER)
            "http://localhost:3001", // Organizer Portal (HOST)
            "http://localhost:3002"  // Admin Console (ADMIN)
        ));
        
        // Allow necessary HTTP methods
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Allow necessary headers for JWT and JSON payloads
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        
        // Essential for sending tokens/credentials across origins
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply this configuration to all backend API endpoints
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}