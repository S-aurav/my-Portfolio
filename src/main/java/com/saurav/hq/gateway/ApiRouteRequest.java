package com.saurav.hq.gateway;

/**
 * DTO for creating/updating an API route manually via the admin panel.
 */
public record ApiRouteRequest(
        String project,
        String module,
        String operation,
        String fullPath,
        String method,
        String description,
        String tags,
        boolean enabled,
        boolean requiresAuth
) {}
