package com.saurav.hq.modules.skill;

import com.saurav.hq.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SkillController {

    private final SkillService service;

    public SkillController(SkillService service) {
        this.service = service;
    }

    // ── Public Endpoints ─────────────────────────────────────────────────────

    @GetMapping("/api/portfolio/skills")
    public ResponseEntity<ApiResponse<List<Skill>>> getPublicSkills() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAllSkills()));
    }

    // ── Admin Endpoints ──────────────────────────────────────────────────────

    @GetMapping("/api/hq/admin/skills")
    public ResponseEntity<ApiResponse<List<Skill>>> getAllSkills() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAllSkills()));
    }

    @PostMapping("/api/hq/admin/skills")
    public ResponseEntity<ApiResponse<Skill>> createSkill(@RequestBody SkillRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Skill created successfully", service.createSkill(request)));
    }

    @PutMapping("/api/hq/admin/skills/{id}")
    public ResponseEntity<ApiResponse<Skill>> updateSkill(
            @PathVariable String id,
            @RequestBody SkillRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Skill updated successfully", service.updateSkill(id, request)));
    }

    @DeleteMapping("/api/hq/admin/skills/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(@PathVariable String id) {
        service.deleteSkill(id);
        return ResponseEntity.ok(ApiResponse.ok("Skill deleted successfully", null));
    }
}
