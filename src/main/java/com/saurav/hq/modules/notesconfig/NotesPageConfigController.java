package com.saurav.hq.modules.notesconfig;

import com.saurav.hq.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class NotesPageConfigController {

    private final NotesPageConfigService service;

    public NotesPageConfigController(NotesPageConfigService service) {
        this.service = service;
    }

    // ── Public Endpoints ─────────────────────────────────────────────────────

    @GetMapping("/api/portfolio/notes-config")
    public ResponseEntity<ApiResponse<NotesPageConfig>> getPublicNotesConfig() {
        NotesPageConfig config = service.getConfig().orElse(new NotesPageConfig());
        return ResponseEntity.ok(ApiResponse.ok(config));
    }

    // ── Admin Endpoints ──────────────────────────────────────────────────────

    @GetMapping("/api/hq/admin/notes-config")
    public ResponseEntity<ApiResponse<NotesPageConfig>> getAdminNotesConfig() {
        NotesPageConfig config = service.getConfig().orElse(new NotesPageConfig());
        return ResponseEntity.ok(ApiResponse.ok(config));
    }

    @PutMapping("/api/hq/admin/notes-config")
    public ResponseEntity<ApiResponse<NotesPageConfig>> saveNotesConfig(@RequestBody NotesPageConfigRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Notes config saved successfully", service.saveConfig(request)));
    }
}
