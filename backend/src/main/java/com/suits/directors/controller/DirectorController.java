package com.suits.directors.controller;

import com.suits.common.dto.ApiResponse;
import com.suits.common.dto.PageResponse;
import com.suits.directors.dto.DirectorRequest;
import com.suits.directors.dto.DirectorResponse;
import com.suits.directors.service.DirectorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/directors")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@Tag(name = "Directors", description = "Director management endpoints")
public class DirectorController {

    private final DirectorService service;

    public DirectorController(DirectorService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<DirectorResponse>>> getAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String kycStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.ok(service.getAll(name, kycStatus, pageable), "OK"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DirectorResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id), "OK"));
    }

    @GetMapping("/by-entity/{entityId}")
    public ResponseEntity<ApiResponse<List<DirectorResponse>>> getByEntity(@PathVariable UUID entityId) {
        return ResponseEntity.ok(ApiResponse.ok(service.getByEntityId(entityId), "OK"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DirectorResponse>> create(@Valid @RequestBody DirectorRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(req), "Director created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DirectorResponse>> update(
            @PathVariable UUID id, @Valid @RequestBody DirectorRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, req), "Director updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Director deactivated"));
    }
}
