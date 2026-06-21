package com.saurav.hq.modules.note;

import com.saurav.hq.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class NoteController {

    private final NoteService service;

    public NoteController(NoteService service) {
        this.service = service;
    }

    // ── Public Endpoints ─────────────────────────────────────────────────────

    @GetMapping("/api/portfolio/notes")
    public ResponseEntity<ApiResponse<List<Note>>> getPublicNotes() {
        return ResponseEntity.ok(ApiResponse.ok(service.getPublicNotes()));
    }

    // ── Admin Endpoints ──────────────────────────────────────────────────────

    @GetMapping("/api/hq/admin/notes")
    public ResponseEntity<ApiResponse<List<Note>>> getAllNotes() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAllNotes()));
    }

    @PostMapping("/api/hq/admin/notes")
    public ResponseEntity<ApiResponse<Note>> createNote(@RequestBody NoteRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Note created successfully", service.createNote(request)));
    }

    @PutMapping("/api/hq/admin/notes/{id}")
    public ResponseEntity<ApiResponse<Note>> updateNote(
            @PathVariable String id,
            @RequestBody NoteRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Note updated successfully", service.updateNote(id, request)));
    }

    @DeleteMapping("/api/hq/admin/notes/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNote(@PathVariable String id) {
        service.deleteNote(id);
        return ResponseEntity.ok(ApiResponse.ok("Note deleted successfully", null));
    }
}
