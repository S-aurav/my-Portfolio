package com.saurav.hq.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.HashSet;
import java.util.Set;

/**
 * Scans all registered Spring MVC endpoints on startup and auto-registers
 * any /api/** routes (excluding internal admin/auth/gateway routes) in the api_routes table.
 *
 * On each startup:
 *   - New routes   → inserted with autoRegistered=true, enabled=true
 *   - Existing routes → stale flag cleared (route is still alive)
 *   - Missing routes (previously auto-registered but no longer in Spring) → marked stale
 *
 * Stale routes are NOT deleted automatically. The admin reviews and removes them manually.
 */
@Component
public class RouteScanner implements ApplicationListener<ApplicationReadyEvent> {

    private static final Logger log = LoggerFactory.getLogger(RouteScanner.class);

    private static final Set<String> EXCLUDED_PREFIXES = Set.of(
            "/api/hq/admin/",
            "/api/hq/auth/",
            "/api/hq/gateway/"
    );

    private final RequestMappingHandlerMapping handlerMapping;
    private final ApiRouteService routeService;

    public RouteScanner(@Qualifier("requestMappingHandlerMapping") RequestMappingHandlerMapping handlerMapping,
                        ApiRouteService routeService) {
        this.handlerMapping = handlerMapping;
        this.routeService = routeService;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        log.info("RouteScanner: scanning registered Spring MVC endpoints...");

        Set<String> liveKeys = new HashSet<>();
        int registered = 0;

        for (RequestMappingInfo info : handlerMapping.getHandlerMethods().keySet()) {
            if (info.getPathPatternsCondition() == null) continue;

            Set<String> methods = new HashSet<>();
            if (info.getMethodsCondition() != null) {
                info.getMethodsCondition().getMethods()
                        .forEach(m -> methods.add(m.name()));
            }
            if (methods.isEmpty()) {
                // No explicit method restriction — skip (catches generic mappings)
                continue;
            }

            for (var pattern : info.getPathPatternsCondition().getPatterns()) {
                String path = pattern.getPatternString();

                if (!path.startsWith("/api/")) continue;
                if (isExcluded(path)) continue;

                // Parse /api/{project}/{module}/{operation} — must have at least 4 segments
                String[] segments = path.split("/");
                // segments: ["", "api", project, module, operation, ...]
                if (segments.length < 5) continue;

                String project   = segments[2];
                String module    = segments[3];
                String operation = segments.length > 5
                        ? String.join("-", java.util.Arrays.copyOfRange(segments, 4, segments.length))
                        : segments[4];

                for (String method : methods) {
                    String liveKey = method.toUpperCase() + ":" + path;
                    liveKeys.add(liveKey);
                    routeService.registerOrUpdate(path, method, project, module, operation);
                    registered++;
                }
            }
        }

        routeService.markStaleIfNotIn(liveKeys);
        log.info("RouteScanner: done. Processed {} endpoint/method combinations.", registered);
    }

    private boolean isExcluded(String path) {
        for (String prefix : EXCLUDED_PREFIXES) {
            if (path.startsWith(prefix)) return true;
        }
        return false;
    }
}
