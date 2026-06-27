package com.saurav.hq.modules.experience;

import com.saurav.hq.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ExperienceController {

    private final ExperienceService service;

    public ExperienceController(ExperienceService service) {
        this.service = service;
    }

    // ── Public Endpoints ─────────────────────────────────────────────────────

    @GetMapping("/api/portfolio/experience")
    public ResponseEntity<ApiResponse<List<Experience>>> getPublicExperiences() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAllExperiences()));
    }

    // ── Admin Endpoints ──────────────────────────────────────────────────────

    @GetMapping("/api/hq/admin/experience")
    public ResponseEntity<ApiResponse<List<Experience>>> getAllExperiences() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAllExperiences()));
    }

    @PostMapping("/api/hq/admin/experience")
    public ResponseEntity<ApiResponse<Experience>> createExperience(@RequestBody ExperienceRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Experience created successfully", service.createExperience(request)));
    }

    @PutMapping("/api/hq/admin/experience/{id}")
    public ResponseEntity<ApiResponse<Experience>> updateExperience(
            @PathVariable String id,
            @RequestBody ExperienceRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Experience updated successfully", service.updateExperience(id, request)));
    }

    @DeleteMapping("/api/hq/admin/experience/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(@PathVariable String id) {
        service.deleteExperience(id);
        return ResponseEntity.ok(ApiResponse.ok("Experience deleted successfully", null));
    }
}
