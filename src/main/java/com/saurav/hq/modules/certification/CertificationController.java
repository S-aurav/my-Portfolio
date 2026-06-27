package com.saurav.hq.modules.certification;

import com.saurav.hq.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CertificationController {

    private final CertificationService service;

    public CertificationController(CertificationService service) {
        this.service = service;
    }

    // ── Public Endpoints ─────────────────────────────────────────────────────

    @GetMapping("/api/portfolio/certifications")
    public ResponseEntity<ApiResponse<List<Certification>>> getPublicCertifications() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAllCertifications()));
    }

    // ── Admin Endpoints ──────────────────────────────────────────────────────

    @GetMapping("/api/hq/admin/certifications")
    public ResponseEntity<ApiResponse<List<Certification>>> getAllCertifications() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAllCertifications()));
    }

    @PostMapping("/api/hq/admin/certifications")
    public ResponseEntity<ApiResponse<Certification>> createCertification(@RequestBody CertificationRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Certification created successfully", service.createCertification(request)));
    }

    @PutMapping("/api/hq/admin/certifications/{id}")
    public ResponseEntity<ApiResponse<Certification>> updateCertification(
            @PathVariable String id,
            @RequestBody CertificationRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Certification updated successfully", service.updateCertification(id, request)));
    }

    @DeleteMapping("/api/hq/admin/certifications/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCertification(@PathVariable String id) {
        service.deleteCertification(id);
        return ResponseEntity.ok(ApiResponse.ok("Certification deleted successfully", null));
    }
}
