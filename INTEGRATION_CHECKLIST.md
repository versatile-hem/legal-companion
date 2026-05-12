# Integration Checklist - Assignments Module

Complete these steps to integrate all generated code into the running application.

---

## Phase 1: Database Setup ✓

- [ ] Verify PostgreSQL is running: `psql -U postgres`
- [ ] Create database if not exists:
  ```sql
  CREATE DATABASE suits_in;
  ```
- [ ] Database will auto-migrate via Flyway when backend starts
  - Location: `backend/src/main/resources/db/migration/V3__add_assignments_module.sql`
  - Validates on startup (ddl-auto: validate)

**Status:** Flyway handles automatically

---

## Phase 2: Backend Integration (Java)

### Step 1: Verify Entities Exist
- [ ] `/backend/src/main/java/com/suits/assignments/entity/`
  - [ ] `Assignment.java`
  - [ ] `AssignmentTemplate.java`
  - [ ] `AssignmentTask.java`
  - [ ] `TaskDocument.java`
  - [ ] `TaskDependency.java`
  - [ ] `AssignmentDocumentRequirement.java`
  - [ ] `Approval.java`
  - [ ] `ActivityLog.java`
  - [ ] `AIInsight.java`

### Step 2: Verify Repositories Exist
- [ ] `/backend/src/main/java/com/suits/assignments/repository/`
  - [ ] `AssignmentRepository.java`
  - [ ] `AssignmentTemplateRepository.java`
  - [ ] `AIInsightRepository.java`
  - [ ] All extend `JpaRepository<Entity, UUID>`

### Step 3: Verify DTOs Exist
- [ ] `/backend/src/main/java/com/suits/assignments/dto/`
  - [ ] `AssignmentDTO.java`
  - [ ] `ResponseDTOs.java` (contains all response models)

### Step 4: Verify Service Layer Exists
- [ ] `/backend/src/main/java/com/suits/assignments/service/`
  - [ ] `AssignmentService.java` (business logic)
    - [ ] Contains: getAssignments(), createAssignment(), updateAssignment(), etc.
  - [ ] `AIService.java` (AI orchestration)
    - [ ] Contains: assessRisk(), predictTimeline(), analyzeDocuments(), suggestNextAction()

### Step 5: Verify Controller Exists
- [ ] `/backend/src/main/java/com/suits/assignments/controller/`
  - [ ] `AssignmentController.java`
    - [ ] 12 REST endpoints defined
    - [ ] @RequestMapping("/api/v1/assignments")
    - [ ] @PreAuthorize annotations for security

### Step 6: Update application.yml
Add to `backend/src/main/resources/application.yml`:

```yaml
# Assignments Module Configuration
spring:
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

app:
  ai:
    service-url: http://localhost:8000
    enabled: true
```

### Step 7: Build & Run Backend
```bash
cd backend
mvn clean spring-boot:run
```

- [ ] Check for compilation errors
- [ ] Wait for "Tomcat started on port(s): 8080"
- [ ] Verify database migration ran successfully
  - Check logs for "Flyway migration V3"

### Step 8: Test Backend
```bash
# Test endpoint exists
curl -H "Authorization: Bearer {token}" http://localhost:8080/api/v1/assignments

# Expected: 200 OK with empty array or existing assignments
```

- [ ] GET /api/v1/assignments returns 200
- [ ] Swagger UI available at http://localhost:8080/swagger-ui.html

**Status:** Backend ready when port 8080 is accessible

---

## Phase 3: Frontend Integration (React/Next.js)

### Step 1: Update API Configuration
Create/update `frontend/lib/constants.ts`:
```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
```

Update `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### Step 2: Create API Client
- [ ] Create `frontend/lib/api-assignments.ts`
  - [ ] Export assignmentsAPI object with all methods
  - [ ] Methods: list(), get(), create(), update(), getTasks(), getDocuments()
  - [ ] AI methods: ai.riskAssessment(), ai.timelinePrediction(), ai.nextAction()

### Step 3: Verify Components Exist
- [ ] `/frontend/app/(dashboard)/assignments/`
  - [ ] `page.tsx` (list view)
  - [ ] `create/page.tsx` (creation wizard)
  - [ ] `[id]/page.tsx` (detail view)
- [ ] `/frontend/components/assignments/` (optional - for reusable components)

### Step 4: Install Frontend
```bash
cd frontend
npm install
```

- [ ] No peer dependency warnings
- [ ] All dependencies installed

### Step 5: Configure Next.js
Update `frontend/next.config.js`:
```javascript
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  },
};
module.exports = nextConfig;
```

### Step 6: Start Frontend Dev Server
```bash
cd frontend
npm run dev
```

- [ ] Check for TypeScript compilation errors
- [ ] Wait for "Ready in 1.2s"
- [ ] Browser opens to http://localhost:3000

### Step 7: Test Frontend Pages
- [ ] Navigate to http://localhost:3000/dashboard/assignments
- [ ] Check for 404 or blank page (expected, API not connected yet)
- [ ] Check browser console for errors

### Step 8: Connect API Client to Components
Update `frontend/app/(dashboard)/assignments/page.tsx`:
```typescript
import { assignmentsAPI } from '@/lib/api-assignments';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    assignmentsAPI.list().then(setAssignments);
  }, []);

  // ... rest of component
}
```

- [ ] Update all page.tsx files to use assignmentsAPI
- [ ] Test: assignments list shows data when backend is running

**Status:** Frontend ready when pages load without errors

---

## Phase 4: AI Service Integration (Python/FastAPI)

### Step 1: Setup Python Environment
```bash
cd ai-service
python --version  # Must be 3.10+
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

- [ ] Virtual environment created
- [ ] `(venv)` appears in terminal

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

- [ ] All packages install successfully
- [ ] No dependency conflicts

### Step 3: Configure Environment
Create `ai-service/.env`:
```env
OPENAI_API_KEY=sk-your-key-here
BACKEND_URL=http://localhost:8080
ENVIRONMENT=development
LOG_LEVEL=INFO
```

- [ ] Set OPENAI_API_KEY (leave blank for mock mode)

### Step 4: Verify main.py Exists
- [ ] `/ai-service/main.py` exists and contains:
  - [ ] FastAPI app initialization
  - [ ] 4 endpoints: /risk-assessment, /timeline-prediction, /document-analysis, /next-action-suggestion
  - [ ] Pydantic models for request/response validation

### Step 5: Start AI Service
```bash
cd ai-service
source venv/bin/activate
python -m uvicorn main:app --reload --port 8000
```

- [ ] Wait for "Uvicorn running on http://127.0.0.1:8000"
- [ ] No Python import errors

### Step 6: Test AI Endpoints
```bash
# Test risk assessment endpoint
curl -X POST http://localhost:8000/risk-assessment \
  -H "Content-Type: application/json" \
  -d '{
    "task_completion": 50,
    "document_completion": 60,
    "due_days": 5,
    "status": "in_progress"
  }'
```

- [ ] Endpoint responds with valid JSON
- [ ] Response includes riskScore, status, factors, recommendations

### Step 7: API Docs Available
- [ ] OpenAPI docs at http://localhost:8000/docs
- [ ] Swagger UI shows all 4 endpoints

**Status:** AI Service ready when port 8000 is accessible

---

## Phase 5: Integration Testing

### Test 1: Database → Backend
```bash
# Check database contents
psql -U postgres -d suits_in -c "SELECT * FROM assignments LIMIT 1;"
# Should show empty or existing assignments
```

- [ ] Tables exist in PostgreSQL
- [ ] Can query assignment_templates
- [ ] Can query assignments

### Test 2: Backend → Frontend
```bash
# From frontend directory
curl http://localhost:8080/api/v1/assignments \
  -H "Authorization: Bearer eyJhbGc..."
```

- [ ] Backend API responds
- [ ] Frontend can fetch /assignments endpoint

### Test 3: Frontend → Backend
In browser console:
```javascript
fetch('http://localhost:8080/api/v1/assignments')
  .then(r => r.json())
  .then(console.log)
```

- [ ] CORS headers present
- [ ] Data returns successfully

### Test 4: Backend → AI Service
In backend logs, watch when AI endpoint is called:
```
POST http://localhost:8000/risk-assessment
```

- [ ] Backend can reach AI service
- [ ] Response is valid

### Test 5: Full Flow
1. [ ] Create assignment via UI (POST to backend)
2. [ ] Backend stores in database
3. [ ] UI fetches and displays assignment
4. [ ] Click AI assessment button
5. [ ] Backend calls AI service
6. [ ] Result displays in UI

---

## Phase 6: Database Seeding (Optional)

### Insert Test Templates
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
  '[{"name":"Name Reservation","duration":3},
    {"name":"DSC Collection","duration":7},
    {"name":"MCA Approval","duration":14}]'::jsonb,
  45,
  45
),
(
  'MGT7_V1',
  'MGT-7 Filing',
  'MGT Filing',
  '1.0',
  true,
  '[{"name":"GA Notice","duration":7},
    {"name":"Annual Report","duration":30},
    {"name":"Certification","duration":5}]'::jsonb,
  60,
  60
);
```

- [ ] Insert test templates
- [ ] Verify they appear in create assignment wizard

---

## Phase 7: Verification Checklist

### All Three Services Running
- [ ] PostgreSQL: `psql -U postgres` (no error)
- [ ] Backend: `curl http://localhost:8080/health` returns 200
- [ ] Frontend: http://localhost:3000 loads without errors
- [ ] AI Service: `curl http://localhost:8000/docs` returns Swagger UI

### Key Files Verified
- [ ] Database migration executed (check Flyway version in app startup logs)
- [ ] Backend JAR built successfully (check target/ directory)
- [ ] Frontend npm modules installed (check node_modules/ exists)
- [ ] AI service requirements installed (check pip list for fastapi)

### Endpoints Working
- [ ] GET /api/v1/assignments → 200 OK
- [ ] GET /health → 200 OK
- [ ] POST /risk-assessment → 200 OK (with valid input)

### UI Accessible
- [ ] Assignments page loads: http://localhost:3000/dashboard/assignments
- [ ] Create assignment link works
- [ ] Detail page loads (if assignments exist)

---

## Troubleshooting Reference

| Issue | Solution |
|-------|----------|
| Java version error | `export JAVA_HOME=$(/usr/libexec/java_home -v 21)` |
| Port 8080 already in use | `lsof -i :8080` then `kill -9 <PID>` |
| Node modules issues | `rm -rf node_modules && npm install` |
| Python import error | `pip install -r requirements.txt` |
| CORS errors | Add `@CrossOrigin` to controller or update CORS config |
| API returns 401 | Ensure Authorization header with valid JWT |
| AI service slow | Check OPENAI_API_KEY if using real API |

---

## Success Criteria

✅ All three services running without errors  
✅ Frontend loads without console errors  
✅ Can create new assignment via UI  
✅ Assignment data persists to database  
✅ AI endpoints respond with predictions  
✅ Assignment list shows created assignments  
✅ Detail page loads assignment data  

---

## Next Phase: Testing & Deployment

Once all services are integrated and working:

1. **Unit Tests:** `mvn test` (backend)
2. **Integration Tests:** Create test data, verify full workflows
3. **Performance Testing:** Load test with bulk assignments
4. **Deployment:** Use docker-compose or Kubernetes manifests
5. **Production Hardening:** Add logging, monitoring, error handling

---

**Created:** May 12, 2026  
**Status:** Ready to Execute  
**Estimated Time:** 30-45 minutes for full integration
