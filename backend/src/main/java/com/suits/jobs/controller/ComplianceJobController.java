package com.suits.jobs.controller;

import com.suits.common.dto.ApiResponse;
import com.suits.common.dto.PageResponse;
import com.suits.jobs.dto.ComplianceJobRequest;
import com.suits.jobs.dto.ComplianceJobResponse;
import com.suits.jobs.service.ComplianceJobService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@Tag(name = "Compliance Jobs", description = "Compliance job workflow management")
public class ComplianceJobController {

    private final ComplianceJobService service;

    public ComplianceJobController(ComplianceJobService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ComplianceJobResponse>>> getAll(
            @RequestParam(required = false) UUID entityId,
            @RequestParam(required = false) UUID clientId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String jobType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.ok(
                service.filter(entityId, clientId, status, jobType, pageable), "OK"));
    }

    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse<List<ComplianceJobResponse>>> getOverdue() {
        return ResponseEntity.ok(ApiResponse.ok(service.getOverdue(), "OK"));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<ComplianceJobResponse>>> getRecent(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(service.getRecent(limit), "OK"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ComplianceJobResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id), "OK"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ComplianceJobResponse>> create(@Valid @RequestBody ComplianceJobRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(req), "Job created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ComplianceJobResponse>> update(
            @PathVariable UUID id, @Valid @RequestBody ComplianceJobRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, req), "Job updated"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ComplianceJobResponse>> updateStatus(
            @PathVariable UUID id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.ok(
                service.updateStatus(id, body.get("status")), "Status updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Job deleted"));
    }
}
