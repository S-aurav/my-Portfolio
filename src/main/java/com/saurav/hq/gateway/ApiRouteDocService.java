package com.saurav.hq.gateway;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApiRouteDocService {

    private final ApiRouteDocRepository repository;

    public ApiRouteDocService(ApiRouteDocRepository repository) {
        this.repository = repository;
    }

    /**
     * Returns existing docs for a route, or creates an empty doc if none exists.
     * Idempotent — safe to call multiple times.
     */
    @Transactional
    public ApiRouteDoc getOrCreate(String routeId) {
        return repository.findByRouteId(routeId)
                .orElseGet(() -> repository.save(new ApiRouteDoc(routeId)));
    }

    /**
     * Upserts the documentation for a given route.
     * Creates a new doc entry if none exists, or updates the existing one.
     */
    @Transactional
    public ApiRouteDoc save(String routeId, ApiRouteDocRequest req) {
        ApiRouteDoc doc = getOrCreate(routeId);
        doc.setRequestBody(req.requestBody());
        doc.setResponseBody(req.responseBody());
        doc.setPathVariables(req.pathVariables());
        doc.setQueryParams(req.queryParams());
        doc.setRequestHeaders(req.requestHeaders());
        doc.setExampleRequest(req.exampleRequest());
        doc.setExampleResponse(req.exampleResponse());
        doc.setNotes(req.notes());
        return repository.save(doc);
    }

    /**
     * Deletes docs for a route. Called when the route itself is deleted.
     */
    @Transactional
    public void deleteByRouteId(String routeId) {
        repository.deleteByRouteId(routeId);
    }
}
