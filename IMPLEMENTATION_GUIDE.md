# Assignments Module - Implementation Guide

**Status:** Ready for Development  
**Created:** May 12, 2026
**Tech Stack:** Java Spring Boot (Backend), Next.js (Frontend), Python (AI Service)

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [AI Service Setup](#ai-service-setup)
6. [Database](#database)
7. [API Documentation](#api-documentation)
8. [Deployment](#deployment)

---

## Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- Python 3.10+
- PostgreSQL 15+
- Maven
- npm/pnpm

### Rapid Setup (5 minutes)

**1. Backend**
```bash
cd backend
mvn clean spring-boot:run
```

**2. Frontend**
```bash
cd frontend
npm install
npm run dev
```

**3. AI Service**
```bash
cd ai-service
pip install -r requirements.txt
python main.py
```

---

## Architecture Overview

### Three-Layer Architecture

```
┌─────────────────────────────────┐
│  Frontend (Next.js + React)     │
│  - Assignments List/Detail      │
│  - Assignment Creation          │
│  - Task Management              │
│  - Document Upload              │
└──────────────┬──────────────────┘
               │ REST API (JSON)
┌──────────────▼──────────────────┐
│  Backend (Spring Boot)          │
│  - REST Controllers             │
│  - Business Logic & Services    │
│  - Database Access (JPA)        │
│  - Auth & Permissions           │
└──────────────┬──────────────────┘
               │ HTTP Calls
┌──────────────▼──────────────────┐
│  AI Service (FastAPI/Python)    │
│  - Risk Assessment              │
│  - Timeline Prediction          │
│  - Document Analysis (OCR)      │
│  - Next Action Suggestions      │
└─────────────────────────────────┘
```

---

## Backend Setup

### 1. JPA Entities

All entities are created in `/backend/src/main/java/com/suits/assignments/entity/`

**Core Entities:**
- `Assignment.java` - Main assignment entity
- `AssignmentTemplate.java` - Reusable templates
- `AssignmentTask.java` - Tasks within assignments
- `TaskDocument.java` - Uploaded documents
- `TaskDependency.java` - Task relationships
- `AssignmentDocumentRequirement.java` - Required documents checklist
- `Approval.java` - Approval workflow states
- `ActivityLog.java` - Audit trail
- `AIInsight.java` - AI-generated insights

### 2. Repositories

Location: `/backend/src/main/java/com/suits/assignments/repository/`

**Repositories:**
- `AssignmentRepository.java` - Query interface for assignments
- `AssignmentTemplateRepository.java` - Template queries
- `AIInsightRepository.java` - AI insight queries

### 3. DTOs & Controllers

Location: `/backend/src/main/java/com/suits/assignments/dto/`

**DTOs:**
- `AssignmentDTO.java` - Response DTOs
- `ResponseDTOs.java` - All response models

**Controllers:**
- `AssignmentController.java` - REST endpoints

### 4. Services

Location: `/backend/src/main/java/com/suits/assignments/service/`

**Services:**
- `AssignmentService.java` - Business logic
- `AIService.java` - AI integration

### 5. Configuration

Add to `application.yml`:

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate  # Do not auto-create, use migrations
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        types:
          imagetype:
            jdbc_type_code: 1111  # For UUID array support

app:
  ai:
    service-url: http://localhost:8000
    enabled: true
  
server:
  port: 8080
```

### 6. Run Backend

```bash
cd backend
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
mvn clean spring-boot:run
```

Backend will be available at `http://localhost:8080`

---

## Frontend Setup

### 1. Project Structure

```
frontend/
├── app/
│   └── (dashboard)/
│       └── assignments/
│           ├── page.tsx          # List page
│           ├── create/
│           │   └── page.tsx       # Creation wizard
│           └── [id]/
│               └── page.tsx       # Detail page
├── components/
│   └── assignments/               # Reusable components
├── lib/
│   └── api-assignments.ts         # API client
└── store/
    └── assignmentStore.ts         # Zustand store
```

### 2. Create API Client

Create `frontend/lib/api-assignments.ts`:

```typescript
import { API_BASE_URL } from './constants';

export const assignmentsAPI = {
  list: (page = 0, limit = 20, filters = {}) =>
    fetch(`${API_BASE_URL}/assignments?page=${page}&limit=${limit}&${new URLSearchParams(filters)}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json()),

  get: (id: string) =>
    fetch(`${API_BASE_URL}/assignments/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json()),

  create: (data: any) =>
    fetch(`${API_BASE_URL}/assignments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  update: (id: string, data: any) =>
    fetch(`${API_BASE_URL}/assignments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  getTasks: (id: string) =>
    fetch(`${API_BASE_URL}/assignments/${id}/tasks`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json()),

  getDocuments: (id: string) =>
    fetch(`${API_BASE_URL}/assignments/${id}/documents`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json()),

  ai: {
    riskAssessment: (id: string) =>
      fetch(`${API_BASE_URL}/assignments/${id}/ai/risk-assessment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` }
      }).then(r => r.json()),

    timelinePrediction: (id: string) =>
      fetch(`${API_BASE_URL}/assignments/${id}/ai/timeline-prediction`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` }
      }).then(r => r.json()),

    nextAction: (id: string) =>
      fetch(`${API_BASE_URL}/assignments/${id}/ai/next-action`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` }
      }).then(r => r.json()),
  }
};
```

### 3. Install & Run

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:3000`

---

## AI Service Setup

### 1. Create Virtual Environment

```bash
cd ai-service
python -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Variables

Create `.env`:

```env
OPENAI_API_KEY=sk-...
BACKEND_URL=http://localhost:8080
ENVIRONMENT=development
LOG_LEVEL=INFO
```

### 4. Run Service

```bash
python -m uvicorn main:app --reload --port 8000
```

AI Service will be available at `http://localhost:8000`

**API Endpoints:**
- `POST /risk-assessment` - Risk assessment
- `POST /timeline-prediction` - Timeline prediction
- `POST /document-analysis` - Document OCR & extraction
- `POST /next-action-suggestion` - Action suggestions

---

## Database

### 1. Migration

The schema is automatically created by Flyway migration. File:
```
backend/src/main/resources/db/migration/V3__add_assignments_module.sql
```

Running this migration is automatic when the backend starts.

### 2. Test Data

Insert test templates:

```sql
INSERT INTO assignment_templates (
  template_code, name, category, version, is_active,
  tasks_definition, estimated_duration_days, sla_days
) VALUES (
  'INCORPORATION_V1',
  'Company Incorporation',
  'Incorporation',
  '1.0',
  true,
  '[{"id":"T001","name":"Name Reservation","duration":3},
    {"id":"T002","name":"DSC Collection","duration":7}]'::jsonb,
  45,
  45
);
```

---

## API Documentation

### Base URL
```
http://localhost:8080/api/v1
```

### Authentication
```
Header: Authorization: Bearer {JWT_TOKEN}
```

### Core Endpoints

#### List Assignments
```http
GET /assignments?page=0&limit=20&status=in_progress&priority=high
```

#### Get Single Assignment
```http
GET /assignments/{id}
```

#### Create Assignment
```http
POST /assignments
Content-Type: application/json

{
  "clientId": "uuid",
  "templateId": "uuid",
  "name": "Incorporation - Acme Ltd",
  "ownerId": "uuid",
  "targetCompletionDate": "2026-06-26",
  "priority": "high"
}
```

#### Update Assignment
```http
PATCH /assignments/{id}
Content-Type: application/json

{
  "status": "in_progress",
  "priority": "critical",
  "ownerId": "uuid"
}
```

#### Get Tasks
```http
GET /assignments/{id}/tasks
```

#### AI Risk Assessment
```http
POST /assignments/{id}/ai/risk-assessment
```

Response:
```json
{
  "riskScore": 7,
  "status": "high",
  "factors": [
    "60% documents collected",
    "3 days to SLA breach"
  ],
  "recommendations": [
    "Escalate to partner immediately"
  ],
  "confidence": 0.88
}
```

---

## Deployment

### Docker

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: suits_in
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/suits_in
      SPRING_DATASOURCE_PASSWORD: password

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"

  ai-service:
    build: ./ai-service
    ports:
      - "8000:8000"
    environment:
      BACKEND_URL: http://backend:8080
```

Run:
```bash
docker-compose up -d
```

### Kubernetes

Use Helm charts for production deployment.

---

## Development Workflow

### 1. Add New Field to Assignment

**Backend:**
```java
// 1. Update Assignment.java entity
@Column(name = "new_field")
private String newField;

// 2. Create Flyway migration (V4__add_to_assignments.sql)
ALTER TABLE assignments ADD COLUMN new_field VARCHAR(255);

// 3. Update DTO
private String newField;

// 4. Update controller endpoint
```

**Frontend:**
```typescript
// 1. Update API types
interface Assignment {
  newField?: string;
}

// 2. Update components
<DisplayField value={assignment.newField} />
```

### 2. Create New API Endpoint

```java
@PostMapping("/assignments/{id}/custom-action")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> customAction(@PathVariable UUID id) {
    // Implementation
}
```

### 3. Add New Task Status

```java
// 1. Update enum in AssignmentTask
public enum TaskStatus {
    // ... existing
    CUSTOM_STATUS
}

// 2. Update migration
ALTER TYPE task_status ADD VALUE 'CUSTOM_STATUS';

// 3. Update controller/service handling
```

---

## Troubleshooting

### Backend won't start
```bash
# Check Java version
java -version  # Should be 21+

# Clear Maven cache
mvn clean clean

# Run with debug
mvn spring-boot:run -X
```

### Frontend pages not loading
```bash
# Clear node_modules
rm -rf node_modules
npm install

# Check backend URL
cat frontend/.env.local  # Ensure correct API_BASE_URL
```

### AI Service errors
```bash
# Check dependencies
pip list | grep fastapi

# Run with verbose logging
python -u main.py

# Check OpenAI key
echo $OPENAI_API_KEY
```

### Database migrations failing
```bash
# Check migration syntax
psql -U postgres -d suits_in -f V3__add_assignments_module.sql

# Reset (dev only)
dropdb suits_in
createdb suits_in
# Then restart backend
```

---

## Next Steps

1. **Complete User Testing** - Validate UX and workflows
2. **Integrate Real OCR** - Use Google Vision or AWS Textract
3. **Deploy AI Models** - Fine-tune models for Indian compliance
4. **Client Portal** - Build client-facing document upload
5. **Team Analytics** - Add performance dashboards
6. **Notifications** - Implement SMS/WhatsApp alerts

---

## Support

For issues or questions:
1. Check logs: `tail -f backend.log`
2. Run tests: `mvn test`
3. Review API docs: `http://localhost:8080/swagger-ui.html`

---

**Version:** 1.0  
**Last Updated:** May 12, 2026
