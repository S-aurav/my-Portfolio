package com.saurav.hq.auth;

import com.saurav.hq.common.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    private final JwtUtil jwtUtil;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    /**
     * Single-owner login. Credentials stored in env vars — no user table needed.
     * Returns a JWT valid for 24h.
     */
    @PostMapping("/api/hq/auth/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest req) {
        if (!adminEmail.equals(req.email()) || !adminPassword.equals(req.password())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid credentials"));
        }
        String token = jwtUtil.generateToken(req.email());
        return ResponseEntity.ok(ApiResponse.ok("Login successful", new AuthResponse(token)));
    }

    @GetMapping("/api/hq/auth/verify")
    public ResponseEntity<ApiResponse<String>> verify() {
        return ResponseEntity.ok(ApiResponse.ok("Token is valid", "authenticated"));
    }
}
