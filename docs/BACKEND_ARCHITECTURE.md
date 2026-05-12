# Backend Architecture - Assignments Module

**Platform:** Java Spring Boot 3 + PostgreSQL + Flyway  
**Status:** Phase 2 - Core APIs & Workflows  
**Date:** 12 May 2026

---

## Architecture Overview

```
┌─ REST API Layer ───────────────────────┐
│ AssignmentController                   │
│ TaskController                          │
│ TemplateController                      │
│ AIController (mock)                     │
│ SearchController                        │
└────────────┬────────────────────────────┘
             ↓
┌─ Service Layer ────────────────────────┐
│ AssignmentService (CRUD + workflows)   │
│ TaskService (CRUD + dependencies)      │
│ TemplateService (templates + cloning)  │
│ WorkflowEngine (state transitions)     │
│ AIService (mock suggestions)            │
│ SearchService (full-text search)        │
└────────────┬────────────────────────────┘
             ↓
┌─ Repository Layer ─────────────────────┐
│ JpaRepository interfaces                │
│ Custom queries for filtering            │
│ Full-text search queries                │
└────────────┬────────────────────────────┘
             ↓
┌─ Database Layer ───────────────────────┐
│ PostgreSQL 13+                          │
│ Flyway migrations (V1...V10)            │
│ Indexes on key columns                  │
│ Full-text search (tsvector)             │
└────────────────────────────────────────┘
```

---

## Folder Structure

```
backend/src/main/java/com/suits/
├── assignments/
│   ├── entity/
│   │   ├── Assignment.java
│   │   ├── AssignmentTemplate.java
│   │   ├── Task.java
│   │   ├── TaskDependency.java
│   │   ├── AssignmentStatus.java (enum)
│   │   ├── TaskStatus.java (enum)
│   │   └── Priority.java (enum)
│   ├── repository/
│   │   ├── AssignmentRepository.java
│   │   ├── AssignmentTemplateRepository.java
│   │   ├── TaskRepository.java
│   │   └── TaskDependencyRepository.java
│   ├── service/
│   │   ├── AssignmentService.java
│   │   ├── TaskService.java
│   │   ├── TemplateService.java
│   │   ├── WorkflowEngine.java
│   │   ├── AIService.java (mock)
│   │   └── SearchService.java
│   ├── controller/
│   │   ├── AssignmentController.java
│   │   ├── TaskController.java
│   │   ├── TemplateController.java
│   │   ├── AIController.java
│   │   └── SearchController.java
│   ├── dto/
│   │   ├── AssignmentDTO.java
│   │   ├── TaskDTO.java
│   │   ├── TemplateDTO.java
│   │   ├── AIResponseDTO.java
│   │   └── FilterDTO.java
│   ├── exception/
│   │   ├── AssignmentException.java
│   │   └── TemplateException.java
│   └── event/
│       └── AssignmentEventPublisher.java
└── common/
    ├── entity/
    │   ├── BaseEntity.java
    │   ├── ActivityLog.java
    │   └── Notification.java
    └── utils/
        ├── JsonUtils.java
        └── ValidationUtils.java
```

---

## Key Implementation Areas

### Phase 2 Priority

1. **Entities & Migrations** - Database schema with all models
2. **Repositories** - Custom queries for filtering & search
3. **Services** - Business logic & workflows
4. **Controllers** - REST API endpoints
5. **DTOs & Validation** - Request/response objects
6. **Seed Data** - 50+ assignments with realistic data
7. **Search & Filtering** - Full-text search capabilities
8. **Mock AI** - AI suggestions & analysis (extensible layer)
9. **Workflow Engine** - State transitions & SLA tracking
10. **Exception Handling** - Global error handling

### Phase 3+ (Future)

- [ ] Queue system (BullMQ/Spring batch)
- [ ] Real-time notifications (WebSocket)
- [ ] Real AI integration (OpenAI/Gemini)
- [ ] Advanced analytics
- [ ] Audit logging
- [ ] Performance optimization

---

## Database Schema Strategy

**Key Principles:**
- Soft deletes (archived_at field)
- Audit columns (created_by, updated_by)
- UUID primary keys
- Strategic indexing on frequently queried columns
- Full-text search support
- Multi-tenant ready (organization_id)

**Main Tables:**
- assignments (500+ rows expected)
- assignment_templates (10-15 master templates)
- tasks (3000+ rows expected)
- task_dependencies (links between tasks)
- activity_logs (audit trail)
- notifications (activity feed)

---

## API Structure

### REST Endpoints

**Assignments:**
```
GET    /api/v1/assignments                 - List with filtering
GET    /api/v1/assignments/{id}            - Get single
POST   /api/v1/assignments                 - Create
PATCH  /api/v1/assignments/{id}            - Update
DELETE /api/v1/assignments/{id}            - Delete (soft)
POST   /api/v1/assignments/{id}/duplicate  - Clone
POST   /api/v1/assignments/search          - Advanced search
```

**Tasks:**
```
POST   /api/v1/assignments/{id}/tasks      - Create task
PATCH  /api/v1/tasks/{id}                  - Update task
DELETE /api/v1/tasks/{id}                  - Delete task
POST   /api/v1/tasks/{id}/status           - Change status
POST   /api/v1/tasks/{id}/dependencies     - Add dependency
```

**Templates:**
```
GET    /api/v1/templates                   - List templates
POST   /api/v1/templates/{id}/clone        - Clone template
POST   /api/v1/templates/{id}/generate     - Generate assignment from template
```

**AI Services:**
```
POST   /api/v1/ai/suggest-tasks            - AI task suggestions
POST   /api/v1/ai/estimate-timeline        - Timeline estimation
POST   /api/v1/ai/analyze-risks            - Risk analysis
```

---

## Data Model Relationships

```
Client 1──→ * Assignment
User 1──→ * Assignment (as owner)
User 1──→ * Task (as assignee)

AssignmentTemplate 1──→ * Task (template tasks)
Assignment 1──→ * Task
Task *──→ * Task (via TaskDependency)

Assignment 1──→ * ActivityLog
Task 1──→ * Comment
```

---

## Implementation Order

```
Week 1: Database & Entities
├── Flyway migration V4 (templates/tasks)
├── Flyway migration V5 (dependencies)
├── Flyway migration V6 (activity logs)
├── Entity POJOs
└── Repositories

Week 2: APIs & Services
├── BaseService pattern
├── AssignmentService + CRUD
├── TaskService + dependencies
├── TemplateService
└── Controllers

Week 3: Features & Data
├── Workflow engine (state transitions)
├── Search & filtering
├── Seed data generation
├── AI mock layer
└── Testing & validation
```

---

## Success Criteria

✅ **Week 1 End:**
- All database migrations applied
- All entities created and compiled
- Repositories with custom queries

✅ **Week 2 End:**
- All API endpoints working
- Services with business logic
- Error handling in place
- Basic validation

✅ **Week 3 End:**
- 50+ realistic assignments loaded
- Workflow state transitions working
- Search/filter fully functional
- AI suggestions responding
- Frontend integration ready

---

## Performance Targets

- List assignments: < 200ms (with filters)
- Create assignment: < 500ms
- Search query: < 300ms
- AI suggestions: < 1000ms (mock)

---

Next: Implementing Flyway migrations and entities.
