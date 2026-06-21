package com.saurav.hq.gateway;

import com.saurav.hq.common.BaseEntity;
import jakarta.persistence.*;

/**
 * Stores request/response schema documentation for a single API route.
 * One-to-one relationship with ApiRoute.
 * All doc fields are plain text — admin can paste JSON, write prose, or leave empty.
 */
@Entity
@Table(name = "api_route_docs")
public class ApiRouteDoc extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /** FK to api_routes.id. Unique — one doc per route. */
    @Column(name = "route_id", nullable = false, unique = true)
    private String routeId;

    /** Description of the request body (JSON Schema, prose, or example JSON). */
    @Column(columnDefinition = "TEXT")
    private String requestBody;

    /** Description of the response body. */
    @Column(columnDefinition = "TEXT")
    private String responseBody;

    /** Path variable descriptions, e.g. "{id} — The route UUID". */
    @Column(columnDefinition = "TEXT")
    private String pathVariables;

    /** Query parameter descriptions, e.g. "page (int) — Page number, default 0". */
    @Column(columnDefinition = "TEXT")
    private String queryParams;

    /** Custom request header descriptions, e.g. "X-Tenant-Id — Tenant identifier". */
    @Column(columnDefinition = "TEXT")
    private String requestHeaders;

    /** Example cURL command or raw JSON body. */
    @Column(columnDefinition = "TEXT")
    private String exampleRequest;

    /** Example JSON response payload. */
    @Column(columnDefinition = "TEXT")
    private String exampleResponse;

    /** Free-form admin notes, caveats, TODO comments. */
    @Column(columnDefinition = "TEXT")
    private String notes;

    // ── Constructors ─────────────────────────────────────────────────────────

    public ApiRouteDoc() {}

    public ApiRouteDoc(String routeId) {
        this.routeId = routeId;
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getId() { return id; }
    public String getRouteId() { return routeId; }
    public void setRouteId(String routeId) { this.routeId = routeId; }
    public String getRequestBody() { return requestBody; }
    public void setRequestBody(String requestBody) { this.requestBody = requestBody; }
    public String getResponseBody() { return responseBody; }
    public void setResponseBody(String responseBody) { this.responseBody = responseBody; }
    public String getPathVariables() { return pathVariables; }
    public void setPathVariables(String pathVariables) { this.pathVariables = pathVariables; }
    public String getQueryParams() { return queryParams; }
    public void setQueryParams(String queryParams) { this.queryParams = queryParams; }
    public String getRequestHeaders() { return requestHeaders; }
    public void setRequestHeaders(String requestHeaders) { this.requestHeaders = requestHeaders; }
    public String getExampleRequest() { return exampleRequest; }
    public void setExampleRequest(String exampleRequest) { this.exampleRequest = exampleRequest; }
    public String getExampleResponse() { return exampleResponse; }
    public void setExampleResponse(String exampleResponse) { this.exampleResponse = exampleResponse; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
