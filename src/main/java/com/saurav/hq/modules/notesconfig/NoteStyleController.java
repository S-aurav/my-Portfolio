package com.saurav.hq.modules.notesconfig;

import com.saurav.hq.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hq/admin/note-styles")
public class NoteStyleController {

    private final NoteStyleService service;

    public NoteStyleController(NoteStyleService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NoteStyle>>> getAllStyles() {
        List<NoteStyle> styles = service.getAllStyles();
        return ResponseEntity.ok(ApiResponse.ok("Fetched all style profiles successfully", styles));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteStyle>> getStyleById(@PathVariable String id) {
        NoteStyle style = service.getStyleById(id);
        return ResponseEntity.ok(ApiResponse.ok("Fetched style profile successfully", style));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NoteStyle>> createStyle(@RequestBody NoteStyleRequest req) {
        NoteStyle style = service.createStyle(req);
        return ResponseEntity.ok(ApiResponse.ok("Created style profile successfully", style));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteStyle>> updateStyle(
            @PathVariable String id,
            @RequestBody NoteStyleRequest req
    ) {
        NoteStyle style = service.updateStyle(id, req);
        return ResponseEntity.ok(ApiResponse.ok("Updated style profile successfully", style));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStyle(@PathVariable String id) {
        service.deleteStyle(id);
        return ResponseEntity.ok(ApiResponse.ok("Deleted style profile successfully", null));
    }
}
