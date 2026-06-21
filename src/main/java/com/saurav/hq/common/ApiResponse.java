package com.saurav.hq.common;

import java.time.Instant;

/**
 * Standard API response envelope for all endpoints.
 * Ensures consistent shape: { success, message, data, timestamp }
 */
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private Instant timestamp = Instant.now();

    // ── Constructors ─────────────────────────────────────────────────────────

    public ApiResponse() {}

    public ApiResponse(boolean success, String message, T data, Instant timestamp) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = timestamp;
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    // ── Static Factories ─────────────────────────────────────────────────────

    public static <T> ApiResponse<T> ok(T data) {
        ApiResponse<T> r = new ApiResponse<>();
        r.success = true;
        r.message = "OK";
        r.data = data;
        r.timestamp = Instant.now();
        return r;
    }

    public static <T> ApiResponse<T> ok(String message, T data) {
        ApiResponse<T> r = new ApiResponse<>();
        r.success = true;
        r.message = message;
        r.data = data;
        r.timestamp = Instant.now();
        return r;
    }

    public static <T> ApiResponse<T> error(String message) {
        ApiResponse<T> r = new ApiResponse<>();
        r.success = false;
        r.message = message;
        r.data = null;
        r.timestamp = Instant.now();
        return r;
    }
}
