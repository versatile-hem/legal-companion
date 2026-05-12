package com.suits.entities.controller;

import com.suits.common.dto.ApiResponse;
import com.suits.common.dto.PageResponse;
import com.suits.entities.dto.LegalEntityRequest;
import com.suits.entities.dto.LegalEntityResponse;
import com.suits.entities.service.LegalEntityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/entities")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@Tag(name = "Entities", description = "Legal Entity management")
public class LegalEntityController {

    private final LegalEntityService service;

    public LegalEntityController(LegalEntityService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "List all legal entities with search & filter")
    public ResponseEntity<ApiResponse<PageResponse<LegalEntityResponse>>> getAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String entityType,
            @RequestParam(defaultValue = "") String state,
            @RequestParam(defaultValue = "") String status,
            @RequestParam(defaultValue = "") String complianceStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        PageResponse<LegalEntityResponse> data = service.getAll(
            search.isBlank() ? null : search,
            entityType.isBlank() ? null : entityType,
            state.isBlank() ? null : state,
            status.isBlank() ? null : status,
            complianceStatus.isBlank() ? null : complianceStatus,
            pageable
        );
        return ResponseEntity.ok(ApiResponse.ok(data, "Entities fetched successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get entity by ID")
    public ResponseEntity<ApiResponse<LegalEntityResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Create new legal entity")
    public ResponseEntity<ApiResponse<LegalEntityResponse>> create(
            @Valid @RequestBody LegalEntityRequest request) {
        LegalEntityResponse created = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(created, "Entity created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update legal entity")
    public ResponseEntity<ApiResponse<LegalEntityResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody LegalEntityRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, request), "Entity updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete legal entity")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Entity deleted successfully"));
    }
}
