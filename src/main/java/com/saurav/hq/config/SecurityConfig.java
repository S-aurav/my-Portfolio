package com.saurav.hq.config;

import com.saurav.hq.auth.JwtAuthFilter;
import com.saurav.hq.gateway.ApiGatewayFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final ApiGatewayFilter apiGatewayFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, ApiGatewayFilter apiGatewayFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.apiGatewayFilter = apiGatewayFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Auth login is the only fully public endpoint
                .requestMatchers("/api/hq/auth/login").permitAll()
                // Public GET requests for Portfolio data (projects, notes)
                .requestMatchers(HttpMethod.GET, "/api/portfolio/**").permitAll()
                // H2 console (dev only)
                .requestMatchers("/h2-console/**").permitAll()
                // Actuator health check (Render)
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                // All admin routes require ADMIN role (JWT validated by JwtAuthFilter)
                .requestMatchers("/api/hq/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/hq/auth/verify").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(apiGatewayFilter, JwtAuthFilter.class);

        http.headers(h -> h.frameOptions(f -> f.sameOrigin()));
        return http.build();
    }
}
