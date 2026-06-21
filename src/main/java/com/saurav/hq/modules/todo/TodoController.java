package com.saurav.hq.modules.todo;

import com.saurav.hq.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class TodoController {

    @GetMapping("/api/todo/tasks/list")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listTasks() {
        List<Map<String, Object>> tasks = List.of(
                Map.of("id", 1, "title", "Test auto-scanning route", "completed", false),
                Map.of("id", 2, "title", "Integrate Next.js dashboard", "completed", true)
        );
        return ResponseEntity.ok(ApiResponse.ok("Tasks retrieved successfully", tasks));
    }
}
