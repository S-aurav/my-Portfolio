package com.saurav.hq.gateway;

/**
 * DTO for creating/updating route documentation via the admin panel.
 * All fields are optional plain text.
 */
public record ApiRouteDocRequest(
        String requestBody,
        String responseBody,
        String pathVariables,
        String queryParams,
        String requestHeaders,
        String exampleRequest,
        String exampleResponse,
        String notes
) {}
