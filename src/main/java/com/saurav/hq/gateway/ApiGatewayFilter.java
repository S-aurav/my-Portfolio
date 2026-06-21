package com.saurav.hq.gateway;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Gateway filter — runs after JWT auth filter on every request.
 * For any /api/** path it checks the api_routes table is_enabled flag.
 * If disabled → 503. Unknown routes pass through (Spring handles 404).
 */
@Component
public class ApiGatewayFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(ApiGatewayFilter.class);
    private final ApiRouteService routeService;

    public ApiGatewayFilter(ApiRouteService routeService) {
        this.routeService = routeService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // Only intercept /api/** paths
        if (!path.startsWith("/api/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Admin and auth routes always pass through (secured by SecurityConfig)
        if (path.startsWith("/api/hq/admin/") || path.startsWith("/api/hq/auth/")
                || path.startsWith("/api/hq/gateway/")) {
            filterChain.doFilter(request, response);
            return;
        }

        boolean enabled = routeService.isRouteEnabled(path, method);
        if (!enabled) {
            log.warn("Blocked disabled route: [{}] {}", method, path);
            response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(
                    "{\"success\":false,\"message\":\"This API endpoint is currently disabled.\",\"data\":null}"
            );
            return;
        }

        filterChain.doFilter(request, response);
    }
}
