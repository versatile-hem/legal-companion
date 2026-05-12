package com.suits.assignments.controller;

import com.suits.assignments.dto.*;
import com.suits.assignments.service.AssignmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assignments")
@CrossOrigin(origins = "*")
@Validated
@Tag(name = "Assignments", description = "Assignment Management Endpoints")
public class AssignmentController {
    
    private final AssignmentService assignmentService;
    
    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }
    
    @GetMapping
    @Operation(summary = "List all assignments")
    public ResponseEntity<Page<AssignmentDTO>> listAssignments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        // Stub: return empty page for now
        Page<AssignmentDTO> emptyPage = new PageImpl<>(new ArrayList<>(), PageRequest.of(page, size), 0);
        return ResponseEntity.ok(emptyPage);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get assignment by ID")
    public ResponseEntity<AssignmentDTO> getAssignment(@PathVariable UUID id) {
        // Return a stub DTO
        AssignmentDTO dto = new AssignmentDTO();
        dto.setId(id);
        dto.setName("Sample Assignment");
        return ResponseEntity.ok(dto);
    }
    
    @PostMapping
    @Operation(summary = "Create new assignment")
    public ResponseEntity<AssignmentDTO> createAssignment(@Valid @RequestBody CreateAssignmentRequest request) {
        AssignmentDTO dto = new AssignmentDTO();
        dto.setId(java.util.UUID.randomUUID());
        dto.setName(request.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update assignment")
    public ResponseEntity<AssignmentDTO> updateAssignment(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAssignmentRequest request) {
        AssignmentDTO dto = new AssignmentDTO();
        dto.setId(id);
        dto.setName(request.getName());
        return ResponseEntity.ok(dto);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete assignment")
    public ResponseEntity<Void> deleteAssignment(@PathVariable UUID id) {
        return ResponseEntity.noContent().build();
    }
}
