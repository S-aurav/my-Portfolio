package com.saurav.hq.modules.project;

import com.saurav.hq.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    // ── Public Endpoints ─────────────────────────────────────────────────────

    @GetMapping("/api/portfolio/projects")
    public ResponseEntity<ApiResponse<List<Project>>> getPublicProjects() {
        return ResponseEntity.ok(ApiResponse.ok(service.getPublicProjects()));
    }

    // ── Admin Endpoints ──────────────────────────────────────────────────────

    @GetMapping("/api/hq/admin/projects")
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAllProjects()));
    }

    @PostMapping("/api/hq/admin/projects")
    public ResponseEntity<ApiResponse<Project>> createProject(@RequestBody ProjectRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Project created successfully", service.createProject(request)));
    }

    @PutMapping("/api/hq/admin/projects/{id}")
    public ResponseEntity<ApiResponse<Project>> updateProject(
            @PathVariable String id,
            @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Project updated successfully", service.updateProject(id, request)));
    }

    @DeleteMapping("/api/hq/admin/projects/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable String id) {
        service.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.ok("Project deleted successfully", null));
    }
}
