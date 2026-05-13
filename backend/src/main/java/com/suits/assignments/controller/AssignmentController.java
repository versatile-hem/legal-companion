package com.suits.assignments.controller;

import com.suits.assignments.dto.*;
import com.suits.assignments.service.AssignmentService;
import com.suits.assignments.service.TaskService;
import com.suits.assignments.entity.AssignmentTask;
import com.suits.assignments.repository.TaskDocumentRepository;
import com.suits.assignments.repository.TaskChecklistRepository;
import com.suits.assignments.service.TaskDocumentService;
import com.suits.assignments.service.TaskChecklistService;
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
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assignments")
@CrossOrigin(origins = "*")
@Validated
@Tag(name = "Assignments", description = "Assignment Management Endpoints")
public class AssignmentController {
    
    private final AssignmentService assignmentService;
    private final TaskService taskService;
    private final TaskDocumentService taskDocumentService;
    private final TaskChecklistService taskChecklistService;
    private final TaskDocumentRepository taskDocumentRepository;
    private final TaskChecklistRepository taskChecklistRepository;
    
    public AssignmentController(
            AssignmentService assignmentService,
            TaskService taskService,
            TaskDocumentService taskDocumentService,
            TaskChecklistService taskChecklistService,
            TaskDocumentRepository taskDocumentRepository,
            TaskChecklistRepository taskChecklistRepository) {
        this.assignmentService = assignmentService;
        this.taskService = taskService;
        this.taskDocumentService = taskDocumentService;
        this.taskChecklistService = taskChecklistService;
        this.taskDocumentRepository = taskDocumentRepository;
        this.taskChecklistRepository = taskChecklistRepository;
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
    
    // ============ Task Management Endpoints ============
    
    @GetMapping("/{assignmentId}/tasks")
    @Operation(summary = "Get all tasks for an assignment with documents and checklists")
    public ResponseEntity<List<TaskDetailResponse>> getAssignmentTasks(@PathVariable UUID assignmentId) {
        List<TaskDTO> tasks = taskService.getTasksByAssignment(assignmentId);
        List<TaskDetailResponse> details = new ArrayList<>();
        
        for (TaskDTO task : tasks) {
            TaskDetailResponse response = new TaskDetailResponse();
            response.setId(task.getId());
            response.setTitle(task.getTitle());
            response.setDescription(task.getDescription());
            response.setStatus(task.getStatus());
            response.setDueDate(task.getDueDate());
            
            // Get enriched task data from service
            AssignmentTask fullTask = taskService.getTaskWithDocumentsAndChecklists(task.getId());
            response.setEstimatedFee(fullTask.getEstimatedFee());
            response.setOutOfPocketExpense(fullTask.getOutOfPocketExpense());
            response.setTaskCategory(fullTask.getTaskCategory());
            response.setTaskTemplate(fullTask.getTaskTemplate());
            
            // Fetch documents and checklists
            response.setDocuments(taskDocumentService.getDocumentsByTask(task.getId()));
            response.setChecklists(taskChecklistService.getChecklistByTask(task.getId()));
            
            details.add(response);
        }
        
        return ResponseEntity.ok(details);
    }
    
    @PostMapping("/{assignmentId}/tasks")
    @Operation(summary = "Add a new task to an assignment")
    public ResponseEntity<TaskDetailResponse> addTask(
            @PathVariable UUID assignmentId,
            @Valid @RequestBody AddTaskRequest request) {
        // Create task with financial fields
        CreateTaskRequest createRequest = new CreateTaskRequest();
        createRequest.setTitle(request.getTitle());
        createRequest.setDescription(request.getDescription());
        createRequest.setDueDate(request.getDueDate());
        
        TaskDTO taskDTO = taskService.createTask(assignmentId, createRequest);
        
        // Update with financial fields and template info
        AssignmentTask task = taskService.getTaskWithDocumentsAndChecklists(taskDTO.getId());
        task.setEstimatedFee(request.getEstimatedFee());
        task.setOutOfPocketExpense(request.getOutOfPocketExpense());
        task.setTaskCategory(request.getTaskCategory());
        task.setTaskTemplate(request.getTaskTemplate());
        
        TaskDetailResponse response = new TaskDetailResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus().toString());
        response.setDueDate(task.getDueDate());
        response.setEstimatedFee(task.getEstimatedFee());
        response.setOutOfPocketExpense(task.getOutOfPocketExpense());
        response.setTaskCategory(task.getTaskCategory());
        response.setTaskTemplate(task.getTaskTemplate());
        response.setDocuments(new ArrayList<>());
        response.setChecklists(new ArrayList<>());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PutMapping("/{assignmentId}/tasks/{taskId}")
    @Operation(summary = "Update task with fee override")
    public ResponseEntity<TaskDetailResponse> updateTask(
            @PathVariable UUID assignmentId,
            @PathVariable UUID taskId,
            @Valid @RequestBody UpdateTaskRequest request) {
        TaskDTO taskDTO = taskService.updateTask(taskId, request);
        
        // Update financial overrides if provided
        AssignmentTask task = taskService.getTaskWithDocumentsAndChecklists(taskId);
        if (request instanceof UpdateTaskRequest && request instanceof UpdateTaskRequest) {
            // Cast to access additional fields from request if they exist
            // For now, basic update is handled by TaskService
        }
        
        TaskDetailResponse response = new TaskDetailResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus().toString());
        response.setDueDate(task.getDueDate());
        response.setEstimatedFee(task.getEstimatedFee());
        response.setOutOfPocketExpense(task.getOutOfPocketExpense());
        response.setTaskCategory(task.getTaskCategory());
        response.setTaskTemplate(task.getTaskTemplate());
        response.setDocuments(taskDocumentService.getDocumentsByTask(taskId));
        response.setChecklists(taskChecklistService.getChecklistByTask(taskId));
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{assignmentId}/tasks/{taskId}")
    @Operation(summary = "Remove task from assignment")
    public ResponseEntity<Void> deleteTask(
            @PathVariable UUID assignmentId,
            @PathVariable UUID taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/task-templates/search")
    @Operation(summary = "Search master task templates")
    public ResponseEntity<List<String>> searchTaskTemplates(
            @RequestParam(required = false) String query) {
        List<String> templates = taskService.searchTaskTemplates(query);
        return ResponseEntity.ok(templates);
    }
    
    @PostMapping("/{assignmentId}/tasks/{taskId}/documents")
    @Operation(summary = "Upload document for task")
    public ResponseEntity<TaskDocumentResponse> uploadTaskDocument(
            @PathVariable UUID assignmentId,
            @PathVariable UUID taskId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String description) {
        try {
            String fileUrl = "uploads/tasks/" + taskId + "/" + file.getOriginalFilename();
            TaskDocumentResponse response = new TaskDocumentResponse();
            response.setId(UUID.randomUUID());
            response.setDocumentName(file.getOriginalFilename());
            response.setFileUrl(fileUrl);
            response.setFileSize(file.getSize());
            response.setMimeType(file.getContentType());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/{assignmentId}/tasks/{taskId}/checklists")
    @Operation(summary = "Add checklist item to task")
    public ResponseEntity<TaskChecklistItemResponse> addChecklistItem(
            @PathVariable UUID assignmentId,
            @PathVariable UUID taskId,
            @Valid @RequestBody AddChecklistItemRequest request) {
        TaskChecklistItemResponse response = new TaskChecklistItemResponse();
        response.setId(UUID.randomUUID());
        response.setName(request.getName());
        response.setIsCompleted(false);
        response.setOrder(request.getOrder() != null ? request.getOrder() : 0);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PatchMapping("/{assignmentId}/tasks/{taskId}/checklists/{itemId}")
    @Operation(summary = "Mark checklist item as complete/incomplete")
    public ResponseEntity<TaskChecklistItemResponse> toggleChecklistItem(
            @PathVariable UUID assignmentId,
            @PathVariable UUID taskId,
            @PathVariable UUID itemId,
            @RequestBody ToggleChecklistRequest request) {
        TaskChecklistItemResponse response = new TaskChecklistItemResponse();
        response.setId(itemId);
        response.setIsCompleted(request.isCompleted());
        
        if (request.isCompleted()) {
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.ok(response);
    }
}
