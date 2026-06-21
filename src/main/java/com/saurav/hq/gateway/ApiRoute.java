package com.saurav.hq.gateway;

import com.saurav.hq.common.BaseEntity;
import jakarta.persistence.*;

/**
 * Represents a registered API route in the HQ gateway.
 * URL pattern: /api/{project}/{module}/{operation}
 *
 * Routes can be auto-discovered by RouteScanner on startup or manually created.
 */
@Entity
@Table(name = "api_routes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"full_path", "method"})
})
public class ApiRoute extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String project;

    @Column(nullable = false)
    private String module;

    @Column(nullable = false)
    private String operation;

    @Column(name = "full_path", nullable = false)
    private String fullPath;

    @Column(nullable = false)
    private String method;

    private String description;

    /** Optional comma-separated tags, e.g. "auth,admin,read-only" */
    private String tags;

    /** Whether this route is currently accepting requests. Admin-controlled. */
    @Column(nullable = false)
    private boolean enabled = true;

    /** Whether this route requires a valid JWT. Informational — enforced by the route itself. */
    @Column(nullable = false)
    private boolean requiresAuth = false;

    /**
     * True if this route was discovered automatically by RouteScanner.
     * False if it was created manually via the admin panel.
     */
    @Column(nullable = false)
    private boolean autoRegistered = false;

    /**
     * True if this route was previously auto-registered but the scanner
     * no longer finds it in the application context (e.g. controller removed).
     * Admin should review and delete stale routes.
     */
    @Column(nullable = false)
    private boolean stale = false;

    // ── Constructors ─────────────────────────────────────────────────────────

    public ApiRoute() {}

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getId() { return id; }
    public String getProject() { return project; }
    public void setProject(String project) { this.project = project; }
    public String getModule() { return module; }
    public void setModule(String module) { this.module = module; }
    public String getOperation() { return operation; }
    public void setOperation(String operation) { this.operation = operation; }
    public String getFullPath() { return fullPath; }
    public void setFullPath(String fullPath) { this.fullPath = fullPath; }
    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public boolean isRequiresAuth() { return requiresAuth; }
    public void setRequiresAuth(boolean requiresAuth) { this.requiresAuth = requiresAuth; }
    public boolean isAutoRegistered() { return autoRegistered; }
    public void setAutoRegistered(boolean autoRegistered) { this.autoRegistered = autoRegistered; }
    public boolean isStale() { return stale; }
    public void setStale(boolean stale) { this.stale = stale; }

    // ── Builder ──────────────────────────────────────────────────────────────

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final ApiRoute route = new ApiRoute();
        public Builder project(String v)        { route.project = v; return this; }
        public Builder module(String v)         { route.module = v; return this; }
        public Builder operation(String v)      { route.operation = v; return this; }
        public Builder fullPath(String v)       { route.fullPath = v; return this; }
        public Builder method(String v)         { route.method = v; return this; }
        public Builder description(String v)    { route.description = v; return this; }
        public Builder tags(String v)           { route.tags = v; return this; }
        public Builder enabled(boolean v)       { route.enabled = v; return this; }
        public Builder requiresAuth(boolean v)  { route.requiresAuth = v; return this; }
        public Builder autoRegistered(boolean v){ route.autoRegistered = v; return this; }
        public Builder stale(boolean v)         { route.stale = v; return this; }
        public ApiRoute build()                 { return route; }
    }
}
