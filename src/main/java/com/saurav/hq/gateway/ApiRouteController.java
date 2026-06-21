package com.saurav.hq.gateway;

import com.saurav.hq.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin-only API route management.
 * All endpoints require JWT (enforced by SecurityConfig → /api/hq/admin/** → hasRole(ADMIN)).
 */
@RestController
public class ApiRouteController {

    private final ApiRouteService service;
    private final ApiRouteDocService docService;

    public ApiRouteController(ApiRouteService service, ApiRouteDocService docService) {
        this.service = service;
        this.docService = docService;
    }

    // ── Route CRUD ────────────────────────────────────────────────────────────

    @GetMapping("/api/hq/admin/routes")
    public ResponseEntity<ApiResponse<List<ApiRoute>>> getAllRoutes() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAll()));
    }

    @GetMapping("/api/hq/admin/routes/project/{project}")
    public ResponseEntity<ApiResponse<List<ApiRoute>>> getByProject(@PathVariable String project) {
        return ResponseEntity.ok(ApiResponse.ok(service.getByProject(project)));
    }

    @PostMapping("/api/hq/admin/routes")
    public ResponseEntity<ApiResponse<ApiRoute>> create(@RequestBody ApiRouteRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Route created", service.create(req)));
    }

    @PutMapping("/api/hq/admin/routes/{id}")
    public ResponseEntity<ApiResponse<ApiRoute>> update(@PathVariable String id,
                                                        @RequestBody ApiRouteRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Route updated", service.update(id, req)));
    }

    @PatchMapping("/api/hq/admin/routes/{id}/toggle")
    public ResponseEntity<ApiResponse<Void>> toggle(@PathVariable String id,
                                                    @RequestBody Map<String, Boolean> body) {
        boolean enabled = body.getOrDefault("enabled", true);
        service.toggle(id, enabled);
        return ResponseEntity.ok(ApiResponse.ok(enabled ? "Route enabled" : "Route disabled", null));
    }

    @DeleteMapping("/api/hq/admin/routes/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Route deleted", null));
    }

    // ── Route Docs ────────────────────────────────────────────────────────────

    @GetMapping("/api/hq/admin/routes/{id}/docs")
    public ResponseEntity<ApiResponse<ApiRouteDoc>> getDocs(@PathVariable String id) {
        ApiRouteDoc doc = docService.getOrCreate(id);
        return ResponseEntity.ok(ApiResponse.ok(doc));
    }

    @PutMapping("/api/hq/admin/routes/{id}/docs")
    public ResponseEntity<ApiResponse<ApiRouteDoc>> saveDocs(@PathVariable String id,
                                                             @RequestBody ApiRouteDocRequest req) {
        ApiRouteDoc doc = docService.save(id, req);
        return ResponseEntity.ok(ApiResponse.ok("Docs saved", doc));
    }
}
