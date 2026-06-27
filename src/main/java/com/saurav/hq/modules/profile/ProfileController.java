package com.saurav.hq.modules.profile;

import com.saurav.hq.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class ProfileController {

    private final ProfileService service;

    public ProfileController(ProfileService service) {
        this.service = service;
    }

    // ── Public Endpoints ─────────────────────────────────────────────────────

    @GetMapping("/api/portfolio/profile")
    public ResponseEntity<ApiResponse<Profile>> getPublicProfile() {
        return service.getProfile()
                .map(profile -> ResponseEntity.ok(ApiResponse.ok(profile)))
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(ApiResponse.error("Profile has not been set up yet")));
    }

    // ── Admin Endpoints ──────────────────────────────────────────────────────

    @GetMapping("/api/hq/admin/profile")
    public ResponseEntity<ApiResponse<Profile>> getAdminProfile() {
        return service.getProfile()
                .map(profile -> ResponseEntity.ok(ApiResponse.ok(profile)))
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(ApiResponse.error("Profile has not been set up yet")));
    }

    @PutMapping("/api/hq/admin/profile")
    public ResponseEntity<ApiResponse<Profile>> saveProfile(@RequestBody ProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Profile saved successfully", service.saveProfile(request)));
    }
}
