package com.saurav.hq.common.storage;

import com.saurav.hq.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/hq/admin/files")
public class FileController {

    private final MediaStorageService storageService;

    public FileController(MediaStorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileUrl = storageService.uploadFile(file);
        return ResponseEntity.ok(ApiResponse.ok("File uploaded successfully", Map.of("url", fileUrl)));
    }
}
