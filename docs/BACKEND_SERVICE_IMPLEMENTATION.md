# Backend Service Implementation Roadmap

## Overview

This document outlines the implementation plan for all backend services, repositories, and REST controllers needed to make the Suits-In API fully operational.

**Current Status:** Database schema complete (V1-V11 migrations) with 30+ realistic assignments and 300+ tasks
**Next Phase:** Service layer implementation
**Estimated Timeline:** 5-7 hours for complete implementation
**Priority Order:** APIs → Search → AI → Queues

---

## Part 1: Service Layer Architecture

### Services to Implement

#### 1. AssignmentService

**Location:** `backend/src/main/java/com/suits/assignments/service/AssignmentService.java`

**Responsibilities:**
- CRUD operations for assignments
- Filtering, sorting, pagination
- Workflow state management
- SLA tracking and notifications
- Template cloning

**Key Methods:**

```java
public class AssignmentService {
    
    // Query Operations
    Page<AssignmentDTO> getAllAssignments(AssignmentFilter filter, Pageable pageable);
    AssignmentDTO getAssignmentById(UUID id);
    List<AssignmentDTO> searchAssignments(String query);
    Page<AssignmentDTO> getAssignmentsByClient(UUID clientId, Pageable pageable);
    Page<AssignmentDTO> getAssignmentsByUser(UUID userId, Pageable pageable);
    Page<AssignmentDTO> getAssignmentsByStatus(AssignmentStatus status, Pageable pageable);
    List<AssignmentDTO> getAssignmentsByTemplate(UUID templateId);
    List<AssignmentDTO> getOverdueAssignments();
    
    // Create/Update Operations
    AssignmentDTO createAssignment(CreateAssignmentRequest request);
    AssignmentDTO updateAssignment(UUID id, UpdateAssignmentRequest request);
    void deleteAssignment(UUID id);
    AssignmentDTO cloneFromTemplate(UUID templateId, CreateFromTemplateRequest request);
    
    // Workflow Operations
    AssignmentDTO transitionStatus(UUID id, AssignmentStatus newStatus, String reason);
    AssignmentDTO assignToUser(UUID id, UUID userId);
    AssignmentDTO markAsBlocked(UUID id, String reason);
    AssignmentDTO resumeAssignment(UUID id);
    
    // SLA & Monitoring
    SLAStatusDTO getSLAStatus(UUID id);
    List<SLABreachDTO> getBreachedSLAs();
    void updateSLAStatus(UUID id);
    List<RiskIndicatorDTO> analyzeRisks(UUID id);
    
    // Data Operations
    long getTotalAssignments();
    Map<String, Long> getStatusDistribution();
    Map<String, Long> getPriorityDistribution();
    TimelineDTO estimateCompletion(UUID id);
}
```

**Dependencies:**
- AssignmentRepository (custom queries)
- TaskService (for task operations)
- NotificationService (for SLA alerts)
- AIService (for risk analysis)
- Mapper: AssignmentMapper (DTO conversions)

**Database Queries to Implement:**

```sql
-- Query 1: Get assignments with status and priority filter
SELECT * FROM assignments 
WHERE status = ? AND priority = ? 
AND (client_id = ? OR client_id IS NULL)
ORDER BY due_date ASC
LIMIT ? OFFSET ?;

-- Query 2: Full-text search
SELECT a.* FROM assignments a
JOIN assignment_search_index asi ON a.id = asi.assignment_id
WHERE asi.search_text @@ plainto_tsquery('english', ?)
ORDER BY ts_rank(asi.search_text, plainto_tsquery('english', ?)) DESC;

-- Query 3: Get overdue assignments
SELECT * FROM assignments a
JOIN sla_tracking st ON a.id = st.assignment_id
WHERE st.sla_end_date < NOW() AND a.status != 'COMPLETED';

-- Query 4: Get assignments by template
SELECT a.* FROM assignments a
JOIN assignment_template_mapping atm ON a.id = atm.assignment_id
WHERE atm.template_id = ? AND atm.mapping_type = 'CLONED_FROM_TEMPLATE';
```

---

#### 2. TaskService

**Location:** `backend/src/main/java/com/suits/assignments/service/TaskService.java`

**Responsibilities:**
- Task CRUD operations
- Dependency management
- Progress tracking
- Checklist management
- Comment threading

**Key Methods:**

```java
public class TaskService {
    
    // Query Operations
    List<TaskDTO> getTasksByAssignment(UUID assignmentId);
    TaskDTO getTaskById(UUID id);
    List<TaskDTO> getTasksByStatus(TaskStatus status);
    Page<TaskDTO> getTasksForUser(UUID userId, Pageable pageable);
    
    // Create/Update Operations
    TaskDTO createTask(UUID assignmentId, CreateTaskRequest request);
    TaskDTO updateTask(UUID id, UpdateTaskRequest request);
    void deleteTask(UUID id);
    TaskDTO completeTask(UUID id);
    
    // Dependency Management
    void addDependency(UUID taskId, UUID dependsOnTaskId, DependencyType type);
    void removeDependency(UUID taskId, UUID dependsOnTaskId);
    List<TaskDTO> getBlockedTasks(UUID assignmentId);
    List<TaskDTO> getBlockingTasks(UUID taskId);
    boolean canCompleteTask(UUID taskId);
    
    // Progress Tracking
    TaskProgressDTO getProgress(UUID assignmentId);
    void updateProgress(UUID assignmentId);
    int getCompletionPercentage(UUID assignmentId);
    
    // Comments
    TaskCommentDTO addComment(UUID taskId, AddCommentRequest request);
    void deleteComment(UUID commentId);
    List<TaskCommentDTO> getComments(UUID taskId);
    
    // Checklists
    TaskChecklistDTO addChecklistItem(UUID taskId, String itemText);
    void completeChecklistItem(UUID checklistId);
    List<ChecklistItemDTO> getChecklistItems(UUID taskId);
    int getChecklistCompletionPercentage(UUID taskId);
    
    // Time Tracking
    TimeEntryDTO logTime(UUID taskId, LogTimeRequest request);
    List<TimeEntryDTO> getTimeEntries(UUID taskId);
    Double getTotalTimeLogged(UUID taskId);
    
    // Attachments
    AttachmentDTO addAttachment(UUID taskId, MultipartFile file);
    void deleteAttachment(UUID attachmentId);
    List<AttachmentDTO> getAttachments(UUID taskId);
}
```

**Dependencies:**
- TaskRepository (with dependency queries)
- AssignmentService (for assignment updates)
- NotificationService (for task notifications)

---

#### 3. TemplateService

**Location:** `backend/src/main/java/com/suits/assignments/service/TemplateService.java`

**Responsibilities:**
- Template CRUD
- Template cloning
- Task template management

**Key Methods:**

```java
public class TemplateService {
    
    // Query Operations
    List<TemplateDTO> getAllTemplates();
    List<TemplateDTO> getPublishedTemplates();
    TemplateDTO getTemplateById(UUID id);
    List<TemplateDTO> getTemplatesByCategory(String category);
    Page<TemplateDTO> searchTemplates(String query, Pageable pageable);
    
    // Create/Update Operations
    TemplateDTO createTemplate(CreateTemplateRequest request);
    TemplateDTO updateTemplate(UUID id, UpdateTemplateRequest request);
    void deleteTemplate(UUID id);
    TemplateDTO publishTemplate(UUID id);
    
    // Template Tasks
    List<TemplateTaskDTO> getTemplateTasks(UUID templateId);
    TemplateTaskDTO addTemplateTask(UUID templateId, CreateTemplateTaskRequest request);
    void removeTemplateTask(UUID taskTemplateId);
    
    // Cloning
    AssignmentDTO cloneTemplate(UUID templateId, CloneTemplateRequest request);
    UUID cloneTemplate(UUID sourceTemplateId, String newName, String newDescription);
    
    // Master Data
    List<TemplateDTO> getMasterTemplates();
    TemplateStatisticsDTO getTemplateStatistics(UUID templateId);
}
```

**Master Templates:** 7 pre-loaded templates (MGT-7, Incorporation, Trademark, etc.)

---

#### 4. NotificationService

**Location:** `backend/src/main/java/com/suits/assignments/service/NotificationService.java`

**Responsibilities:**
- User notifications
- SLA alerts
- Activity feed

**Key Methods:**

```java
public class NotificationService {
    
    // Notifications
    Page<NotificationDTO> getUserNotifications(UUID userId, Pageable pageable);
    long getUnreadCount(UUID userId);
    void markAsRead(UUID notificationId);
    void markAllAsRead(UUID userId);
    
    // Create Notifications
    void notifyAssignmentCreated(UUID assignmentId);
    void notifyTaskUpdated(UUID taskId);
    void notifyCommentAdded(UUID commentId);
    void notifyAssignmentCompleted(UUID assignmentId);
    void notifySLAWarning(UUID assignmentId);
    void notifySLABreach(UUID assignmentId);
    void notifyBlockedTask(UUID taskId);
    
    // Activity Feed
    List<ActivityLogDTO> getActivityFeed(UUID assignmentId);
    List<ActivityLogDTO> getUserActivityFeed(UUID userId);
}
```

---

#### 5. SearchService

**Location:** `backend/src/main/java/com/suits/assignments/service/SearchService.java`

**Responsibilities:**
- Full-text search
- Filter combinations
- Search result ranking

**Key Methods:**

```java
public class SearchService {
    
    // Full-text Search
    List<AssignmentDTO> search(String query);
    Page<AssignmentDTO> searchWithFilters(SearchRequest request, Pageable pageable);
    
    // Advanced Search
    List<AssignmentDTO> searchByFieldValue(String field, String value);
    List<AssignmentDTO> searchByDateRange(LocalDate startDate, LocalDate endDate);
    List<AssignmentDTO> searchBySLAStatus(SLAStatus status);
    
    // Index Management
    void reindexAssignment(UUID assignmentId);
    void reindexAllAssignments();
}
```

---

#### 6. AIService (Mock Implementation)

**Location:** `backend/src/main/java/com/suits/assignments/service/AIService.java`

**Responsibilities:**
- Task suggestions (mock)
- Risk analysis (mock)
- Timeline estimation (mock)
- Extensible for real AI later

**Key Methods:**

```java
public class AIService {
    
    // Mock AI Methods (return deterministic results based on data)
    List<TaskSuggestionDTO> suggestNextTasks(UUID assignmentId);
    RiskAnalysisDTO analyzeRisk(UUID assignmentId);
    TimelineEstimateDTO estimateTimeline(UUID assignmentId);
    List<OptimizationDTO> suggestOptimizations(UUID assignmentId);
    
    // Insights
    void generateInsights(UUID assignmentId);
    List<AIInsightDTO> getInsights(UUID assignmentId);
    
    // Extensibility
    AISuggestionDTO callExternalAI(AIPrompt prompt); // For future OpenAI/Gemini integration
}
```

**Mock Logic Examples:**
```java
// Risk Analysis: Based on status, priority, overdue days
private RiskAnalysisDTO analyzeRisk(Assignment a) {
    int riskScore = 0;
    if (a.getStatus() == BLOCKED) riskScore += 40;
    if (a.getPriority() == CRITICAL) riskScore += 30;
    if (daysUntilDue(a) < 2) riskScore += 20;
    
    return new RiskAnalysisDTO(
        riskScore,
        getRiskLevel(riskScore),
        generateRecommendation(riskScore)
    );
}

// Timeline Estimation: Based on remaining tasks and completion rate
private TimelineEstimateDTO estimateTimeline(Assignment a) {
    List<Task> remainingTasks = getIncompleteTasks(a);
    double totalHours = remainingTasks.stream()
        .mapToDouble(Task::getEstimatedHours).sum();
    
    // Assume 6 hours productive work per day
    int estimatedDays = (int) Math.ceil(totalHours / 6.0);
    LocalDate estimatedCompletion = LocalDate.now().plusDays(estimatedDays);
    
    return new TimelineEstimateDTO(
        estimatedDays,
        estimatedCompletion,
        estimatedCompletion.isBefore(a.getDueDate()) ? "On Track" : "At Risk"
    );
}
```

---

## Part 2: Repository Layer

### Custom Query Repositories

#### AssignmentRepository

```java
@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {
    
    Page<Assignment> findByStatus(AssignmentStatus status, Pageable pageable);
    Page<Assignment> findByClientId(UUID clientId, Pageable pageable);
    Page<Assignment> findByOwnerId(UUID ownerId, Pageable pageable);
    Page<Assignment> findByPriority(PriorityLevel priority, Pageable pageable);
    
    Page<Assignment> findByStatusAndPriority(
        AssignmentStatus status, PriorityLevel priority, Pageable pageable);
    
    Page<Assignment> findByDueDateBetween(
        LocalDate startDate, LocalDate endDate, Pageable pageable);
    
    List<Assignment> findByDueDateBeforeAndStatusNot(
        LocalDate date, AssignmentStatus status);
    
    List<Assignment> findByStatusInAndClientIdOrderByDueDateAsc(
        List<AssignmentStatus> statuses, UUID clientId);
    
    // Full-text search (custom query)
    @Query(nativeQuery = true, value = """
        SELECT a.* FROM assignments a
        JOIN assignment_search_index asi ON a.id = asi.assignment_id
        WHERE asi.search_text @@ plainto_tsquery('english', ?1)
        ORDER BY ts_rank(asi.search_text, plainto_tsquery('english', ?1)) DESC
        LIMIT ?2 OFFSET ?3
    """)
    List<Assignment> fullTextSearch(String query, int limit, int offset);
    
    // Complex filter query
    @Query("""
        SELECT a FROM Assignment a
        WHERE (:status IS NULL OR a.status = :status)
        AND (:priority IS NULL OR a.priority = :priority)
        AND (:clientId IS NULL OR a.clientId = :clientId)
        AND (:ownerId IS NULL OR a.ownerId = :ownerId)
        AND (CAST(:dueDateFrom AS date) IS NULL OR a.dueDate >= :dueDateFrom)
        AND (CAST(:dueDateTo AS date) IS NULL OR a.dueDate <= :dueDateTo)
        ORDER BY a.dueDate ASC
    """)
    Page<Assignment> filterAssignments(
        @Param("status") AssignmentStatus status,
        @Param("priority") PriorityLevel priority,
        @Param("clientId") UUID clientId,
        @Param("ownerId") UUID ownerId,
        @Param("dueDateFrom") LocalDate dueDateFrom,
        @Param("dueDateTo") LocalDate dueDateTo,
        Pageable pageable
    );
}
```

#### TaskRepository

```java
@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    
    List<Task> findByAssignmentId(UUID assignmentId);
    Page<Task> findByAssignmentIdAndStatus(
        UUID assignmentId, TaskStatus status, Pageable pageable);
    
    List<Task> findByAssignmentIdOrderByTaskOrder(UUID assignmentId);
    
    long countByAssignmentIdAndStatus(UUID assignmentId, TaskStatus status);
    
    // Task dependencies
    @Query("""
        SELECT t FROM Task t
        WHERE t.id IN (
            SELECT td.toTaskId FROM TaskDependency td
            WHERE td.fromTaskId = :taskId
        )
    """)
    List<Task> findDependentTasks(@Param("taskId") UUID taskId);
    
    // Blocked tasks (with incomplete dependencies)
    @Query("""
        SELECT t FROM Task t
        WHERE t.assignmentId = :assignmentId
        AND t.status != 'COMPLETED'
        AND t.id IN (
            SELECT td.toTaskId FROM TaskDependency td
            WHERE td.fromTaskId IN (
                SELECT t2.id FROM Task t2 
                WHERE t2.assignmentId = :assignmentId 
                AND t2.status != 'COMPLETED'
            )
        )
    """)
    List<Task> findBlockedTasks(@Param("assignmentId") UUID assignmentId);
}
```

#### TemplateRepository

```java
@Repository
public interface TemplateRepository extends JpaRepository<AssignmentTemplate, UUID> {
    
    List<AssignmentTemplate> findByIsPublishedTrue();
    List<AssignmentTemplate> findByCategory(String category);
    List<AssignmentTemplate> findByIsPublishedTrueOrderByCreatedAtDesc();
    
    @Query(nativeQuery = true, value = """
        SELECT * FROM assignment_templates
        WHERE is_published = true
        AND name ILIKE CONCAT('%', ?1, '%')
        OR description ILIKE CONCAT('%', ?1, '%')
    """)
    List<AssignmentTemplate> searchPublishedTemplates(String query);
}
```

#### SLATrackingRepository

```java
@Repository
public interface SLATrackingRepository extends JpaRepository<SLATracking, UUID> {
    
    SLATracking findByAssignmentId(UUID assignmentId);
    
    List<SLATracking> findBySLAStatus(SLAStatus status);
    
    List<SLATracking> findBySLAEndDateBefore(LocalDateTime dateTime);
    
    @Query("""
        SELECT s FROM SLATracking s
        WHERE s.slaStatus = 'WARNING'
        AND s.warningNotified = false
    """)
    List<SLATracking> getUnnotifiedWarnings();
    
    @Query("""
        SELECT s FROM SLATracking s
        WHERE s.slaStatus = 'BREACH'
        AND s.breachNotified = false
    """)
    List<SLATracking> getUnnotifiedBreaches();
}
```

---

## Part 3: REST Controllers

### AssignmentController

**Location:** `backend/src/main/java/com/suits/assignments/controller/AssignmentController.java`

**Endpoints:**

```
GET    /api/v1/assignments                    # List all (with pagination)
GET    /api/v1/assignments/{id}               # Get one
POST   /api/v1/assignments                    # Create
PUT    /api/v1/assignments/{id}               # Update
DELETE /api/v1/assignments/{id}               # Delete
GET    /api/v1/assignments/search             # Full-text search
GET    /api/v1/assignments/filter             # Advanced filtering
GET    /api/v1/assignments/byClient/{clientId}
GET    /api/v1/assignments/byUser/{userId}
GET    /api/v1/assignments/byTemplate/{templateId}
GET    /api/v1/assignments/overdue            # Overdue list
GET    /api/v1/assignments/{id}/sla           # SLA details
GET    /api/v1/assignments/{id}/risks         # Risk analysis
POST   /api/v1/assignments/{id}/transition    # Change status
POST   /api/v1/assignments/{id}/assign        # Assign to user
POST   /api/v1/assignments/{id}/block         # Mark blocked
POST   /api/v1/assignments/{id}/resume        # Resume from blocked
POST   /api/v1/assignments/clone/{templateId} # Clone from template
```

**Method Signatures:**

```java
@RestController
@RequestMapping("/api/v1/assignments")
@RequiredArgsConstructor
public class AssignmentController {
    
    private final AssignmentService assignmentService;
    private final SearchService searchService;
    
    @GetMapping
    public ResponseEntity<Page<AssignmentDTO>> listAssignments(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String priority,
        @RequestParam(required = false) UUID clientId,
        @RequestParam(required = false) UUID ownerId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "dueDate") String sortBy
    ) {
        AssignmentFilter filter = buildFilter(status, priority, clientId, ownerId);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        return ResponseEntity.ok(assignmentService.getAllAssignments(filter, pageable));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AssignmentDTO> getAssignment(@PathVariable UUID id) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(id));
    }
    
    @PostMapping
    public ResponseEntity<AssignmentDTO> createAssignment(
        @Valid @RequestBody CreateAssignmentRequest request
    ) {
        return ResponseEntity.status(CREATED)
            .body(assignmentService.createAssignment(request));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<AssignmentDTO> updateAssignment(
        @PathVariable UUID id,
        @Valid @RequestBody UpdateAssignmentRequest request
    ) {
        return ResponseEntity.ok(assignmentService.updateAssignment(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable UUID id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<AssignmentDTO>> search(
        @RequestParam String query
    ) {
        return ResponseEntity.ok(searchService.search(query));
    }
    
    @PostMapping("/{id}/transition")
    public ResponseEntity<AssignmentDTO> transitionStatus(
        @PathVariable UUID id,
        @RequestParam String newStatus,
        @RequestParam(required = false) String reason
    ) {
        AssignmentStatus status = AssignmentStatus.valueOf(newStatus);
        return ResponseEntity.ok(
            assignmentService.transitionStatus(id, status, reason)
        );
    }
    
    @PostMapping("/clone/{templateId}")
    public ResponseEntity<AssignmentDTO> cloneFromTemplate(
        @PathVariable UUID templateId,
        @Valid @RequestBody CreateFromTemplateRequest request
    ) {
        return ResponseEntity.status(CREATED)
            .body(assignmentService.cloneFromTemplate(templateId, request));
    }
    
    // ... additional endpoints
}
```

---

### TaskController

```
GET    /api/v1/assignments/{assignmentId}/tasks
GET    /api/v1/tasks/{id}
POST   /api/v1/assignments/{assignmentId}/tasks
PUT    /api/v1/tasks/{id}
DELETE /api/v1/tasks/{id}
POST   /api/v1/tasks/{id}/complete
POST   /api/v1/tasks/{id}/comments
GET    /api/v1/tasks/{id}/comments
POST   /api/v1/tasks/{id}/checklists
GET    /api/v1/tasks/{id}/checklists
POST   /api/v1/tasks/{id}/time-entries
GET    /api/v1/tasks/{id}/dependencies
POST   /api/v1/tasks/{id}/dependencies
```

---

### SearchController

```
GET /api/v1/search/assignments
GET /api/v1/search/advanced
POST /api/v1/search/reindex
```

---

### AIController

```
GET  /api/v1/assignments/{id}/ai/suggestions
GET  /api/v1/assignments/{id}/ai/risks
GET  /api/v1/assignments/{id}/ai/timeline
GET  /api/v1/assignments/{id}/ai/insights
POST /api/v1/assignments/{id}/ai/generate-insights
```

---

## Part 4: DTOs and Request/Response Objects

### Key DTOs

```java
@Data
@Builder
public class AssignmentDTO {
    private UUID id;
    private String title;
    private String description;
    private UUID clientId;
    private String clientName;
    private UUID ownerId;
    private String ownerName;
    private AssignmentStatus status;
    private AssignmentType type;
    private PriorityLevel priority;
    private LocalDate dueDate;
    private Integer estimatedHours;
    private Integer actualHours;
    private String riskLevel; // LOW, MEDIUM, HIGH
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private SLAStatusDTO slaStatus;
    private Integer completionPercentage;
}

@Data
@Builder
public class TaskDTO {
    private UUID id;
    private UUID assignmentId;
    private String name;
    private String description;
    private TaskStatus status;
    private PriorityLevel priority;
    private Integer estimatedHours;
    private LocalDate dueDate;
    private Integer taskOrder;
    private List<ChecklistItemDTO> checklists;
    private List<TaskCommentDTO> comments;
    private Double totalTimeLogged;
}

@Data
@Builder
public class AssignmentFilter {
    private AssignmentStatus status;
    private AssignmentType type;
    private PriorityLevel priority;
    private UUID clientId;
    private UUID ownerId;
    private LocalDate dueDateFrom;
    private LocalDate dueDateTo;
    private String searchQuery;
}

@Data
@Builder
public class RiskAnalysisDTO {
    private Integer riskScore; // 0-100
    private String riskLevel; // LOW, MEDIUM, HIGH, CRITICAL
    private List<String> riskFactors;
    private List<String> recommendations;
}

@Data
@Builder
public class TimelineEstimateDTO {
    private Integer estimatedDays;
    private LocalDate estimatedCompletion;
    private String status; // On Track, At Risk, Delayed
    private List<String> recommendations;
}

@Data
@Builder
public class SLAStatusDTO {
    private SLAStatus status; // ON_TRACK, WARNING, BREACH
    private LocalDateTime slaEndDate;
    private Integer daysRemaining;
    private Boolean breachNotified;
    private Boolean warningNotified;
}
```

---

## Part 5: Implementation Order

### Week 1: Core Services & Repositories

**Day 1:**
- [ ] Create AssignmentRepository with all custom queries
- [ ] Create TaskRepository with dependency queries
- [ ] Create DTOs (AssignmentDTO, TaskDTO, filters)

**Day 2:**
- [ ] Implement AssignmentService (all methods)
- [ ] Implement TaskService (all methods)
- [ ] Add service unit tests

**Day 3:**
- [ ] Create AssignmentController endpoints
- [ ] Create TaskController endpoints
- [ ] Add request/response validation

**Day 4 (continued):**
- [ ] Implement TemplateService
- [ ] Implement SearchService with full-text queries
- [ ] Test all endpoints with Postman/curl

**Day 5:**
- [ ] Implement NotificationService
- [ ] Implement AIService (mock implementation)
- [ ] Create comprehensive API documentation (Swagger)

### Week 2: Integration & Optimization

**Day 6:**
- [ ] Test full workflow (create → update → complete)
- [ ] Verify SLA tracking and notifications
- [ ] Load testing with seed data

**Day 7:**
- [ ] Connect frontend to backend APIs
- [ ] Update AssignmentStore to call real endpoints
- [ ] Test end-to-end data flow

**Day 8:**
- [ ] Performance optimization (caching, N+1 query fixes)
- [ ] Error handling and logging
- [ ] Security (CORS, authentication prep)

**Day 9:**
- [ ] Docker build and test
- [ ] Deployment verification
- [ ] Integration testing

**Day 10:**
- [ ] Buffer/bug fixes
- [ ] Documentation finalization
- [ ] Handoff to QA

---

## Part 6: Testing Strategy

### Unit Tests
```java
// AssignmentServiceTest.java
@SpringBootTest
public class AssignmentServiceTest {
    @Mock private AssignmentRepository repository;
    @Mock private TaskService taskService;
    @InjectMocks private AssignmentService service;
    
    @Test
    void testGetAssignmentById_Found() {
        // Arrange
        UUID id = UUID.randomUUID();
        Assignment assignment = createTestAssignment(id);
        when(repository.findById(id)).thenReturn(Optional.of(assignment));
        
        // Act
        AssignmentDTO result = service.getAssignmentById(id);
        
        // Assert
        assertThat(result.getId()).isEqualTo(id);
        verify(repository).findById(id);
    }
    
    @Test
    void testTransitionStatus_ValidTransition() {
        // Arrange
        UUID id = UUID.randomUUID();
        Assignment assignment = createTestAssignment(id);
        assignment.setStatus(PENDING);
        when(repository.findById(id)).thenReturn(Optional.of(assignment));
        
        // Act
        AssignmentDTO result = service.transitionStatus(
            id, IN_PROGRESS, "Started by user"
        );
        
        // Assert
        assertThat(result.getStatus()).isEqualTo(IN_PROGRESS);
        verify(repository).save(any(Assignment.class));
    }
}
```

### Integration Tests
```java
// AssignmentControllerTest.java
@SpringBootTest(webEnvironment = RANDOM_PORT)
public class AssignmentControllerTest {
    @Autowired private TestRestTemplate restTemplate;
    @Autowired private AssignmentRepository repository;
    
    @Test
    void testListAssignments_ReturnsPagedResult() {
        // Arrange
        for (int i = 0; i < 30; i++) {
            repository.save(createTestAssignment());
        }
        
        // Act
        ResponseEntity<PageResponseDTO> response = restTemplate.getForEntity(
            "/api/v1/assignments?page=0&size=20",
            PageResponseDTO.class
        );
        
        // Assert
        assertThat(response.getStatusCode()).isEqualTo(OK);
        assertThat(response.getBody().getTotalElements()).isEqualTo(30);
        assertThat(response.getBody().getContent().size()).isEqualTo(20);
    }
}
```

---

## Part 7: Error Handling

### CustomException Hierarchy

```java
public class AppException extends RuntimeException {
    private final ErrorCode errorCode;
    private final Map<String, Object> context;
}

public class ResourceNotFoundException extends AppException {
    public ResourceNotFoundException(String resource, UUID id) {
        super(
            String.format("%s not found with id: %s", resource, id),
            ErrorCode.RESOURCE_NOT_FOUND,
            Map.of("resource", resource, "id", id)
        );
    }
}

public class InvalidStateTransitionException extends AppException {
    public InvalidStateTransitionException(
        AssignmentStatus from, AssignmentStatus to
    ) {
        super(
            String.format("Cannot transition from %s to %s", from, to),
            ErrorCode.INVALID_STATE_TRANSITION,
            Map.of("from", from, "to", to)
        );
    }
}
```

### Global Exception Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
        ResourceNotFoundException ex
    ) {
        return ResponseEntity.status(NOT_FOUND)
            .body(ErrorResponse.builder()
                .errorCode(ex.getErrorCode())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build()
            );
    }
    
    @ExceptionHandler(InvalidStateTransitionException.class)
    public ResponseEntity<ErrorResponse> handleInvalidTransition(
        InvalidStateTransitionException ex
    ) {
        return ResponseEntity.status(BAD_REQUEST)
            .body(ErrorResponse.builder()
                .errorCode(ex.getErrorCode())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build()
            );
    }
}
```

---

## Part 8: API Documentation Example

### Swagger/OpenAPI Setup

```yaml
openapi: 3.0.0
info:
  title: Suits-In Assignment Management API
  version: 1.0.0
  description: Complete REST API for managing legal assignments

servers:
  - url: http://localhost:8080
    description: Development server
  - url: https://api.suits-in.com
    description: Production server

paths:
  /api/v1/assignments:
    get:
      summary: List all assignments
      tags:
        - Assignments
      parameters:
        - name: status
          in: query
          description: Filter by assignment status
          schema:
            type: string
            enum: [PENDING, IN_PROGRESS, COMPLETED, BLOCKED, WAITING_FOR_CLIENT, UNDER_REVIEW, CANCELLED]
        - name: priority
          in: query
          description: Filter by priority
          schema:
            type: string
            enum: [LOW, MEDIUM, HIGH, CRITICAL]
        - name: page
          in: query
          description: Page number (0-indexed)
          schema:
            type: integer
            default: 0
        - name: size
          in: query
          description: Page size
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: List of assignments
          content:
            application/json:
              schema:
                type: object
                properties:
                  content:
                    type: array
                    items:
                      $ref: '#/components/schemas/AssignmentDTO'
                  totalElements:
                    type: integer
                  totalPages:
                    type: integer
                  currentPage:
                    type: integer
```

---

## Summary

**Services to Build:** 6 (Assignment, Task, Template, Notification, Search, AI)
**Repositories:** 5 custom query repositories
**Controllers:** 5 REST controllers
**Key Methods:** 100+
**API Endpoints:** 40+
**Estimated Lines of Code:** 10,000+

**Deliverables:**
✅ Service layer (business logic)
✅ Repository layer (data access)
✅ REST API layer (HTTP endpoints)
✅ Error handling (global exception handler)
✅ API documentation (Swagger/OpenAPI)
✅ Unit & integration tests
✅ Full-text search implementation
✅ Notification system
✅ AI mock service (extensible for real AI)

**Next Phase After This:** Backend services complete → Frontend API integration → End-to-end testing → Production deployment
