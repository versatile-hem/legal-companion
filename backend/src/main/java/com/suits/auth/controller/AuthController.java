package com.suits.auth.controller;

import com.suits.auth.dto.LoginRequest;
import com.suits.auth.dto.LoginResponse;
import com.suits.auth.dto.SignupRequest;
import com.suits.auth.service.AuthService;
import com.suits.common.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Login successful"));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<LoginResponse>> signup(@Valid @RequestBody SignupRequest request) {
        LoginResponse response = authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Account created successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<String>> getCurrentUser() {
        return ResponseEntity.ok(ApiResponse.ok("Current user endpoint", "Success"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> refreshToken(@RequestHeader("Authorization") String token) {
        // Implementation for refresh token logic
        return ResponseEntity.ok(ApiResponse.ok(null, "Token refreshed successfully"));
    }
}
