# Assignments Module Design
## Production-Grade AI-First Company Secretary Platform

**Last Updated:** May 12, 2026  
**Version:** 1.0 - Comprehensive Design Specification

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Feature Architecture](#feature-architecture)
3. [Database Schema](#database-schema)
4. [API Design](#api-design)
5. [UX/UI Architecture](#uxui-architecture)
6. [State Machine & Workflows](#state-machine--workflows)
7. [AI Integration Design](#ai-integration-design)
8. [Permission & Role System](#permission--role-system)
9. [Sample Templates & Data](#sample-templates--data)
10. [Tech Stack](#tech-stack)
11. [Implementation Roadmap](#implementation-roadmap)
12. [Security & Scalability](#security--scalability)
13. [Future Vision](#future-vision)

---

## Executive Summary

The `/assignments` module is the operational heart of the Suits In platform. It orchestrates the complete lifecycle of legal and secretarial work for clients:

- **Assignment Types**: Predefined templates (Incorporation, MGT-7, DIR-3 KYC, RBI Filings, etc.)
- **Multi-task Workflows**: Complex assignments decomposed into logical, dependent tasks
- **AI-Assisted Operations**: Machine learning for timeline prediction, document extraction, and workflow optimization
- **Team Collaboration**: Real-time updates, approval mechanisms, and role-based access
- **Compliance-First**: Built-in SLA tracking, regulatory timelines, and audit trails

### Core Objects

```
Assignment (ID, type, client, status, owner, due_date, ...)
  ├── Task (name, status, assignee, due_date, ...)
  │   ├── SubTask / TaskChecklist
  │   ├── TaskDependency (can't start until another task completes)
  │   ├── TaskAttachment / Document
  │   └── TaskApproval (reviewer, status)
  ├── Document (required, collected, verified)
  ├── Approval (stage, reviewer, status)
  ├── Activity / Audit Log
  └── AI Insight (predictions, recommendations)
```

---

## Feature Architecture

### 1. Assignment Listing Page (`/assignments`)

#### A. View Modes
- **Table View**: Dense, column-rich, sortable, filterable
- **Kanban View**: Status-based swimlanes with drag-and-drop
- **Calendar View**: Deadline-centric timeline
- **Timeline/Gantt**: Task dependency visualization
- **Quick Stats Panel**: Active assignments, overdue, at-risk

#### B. Search & Filter System

**Quick Filters:**
```
Status: All, Pending, In Progress, Waiting for Client, In Review, Completed, Blocked
Priority: All, Critical, High, Medium, Low
Client: [Multi-select dropdown]
Assignment Type: Incorporation, MGT-7, DIR-3 KYC, AOC-4, RBI Filing, etc.
Assigned To: [Multi-select team members]
Due Date: Today, This Week, This Month, Overdue
Compliance Risk: Low, Medium, High
```

**AI Search (Natural Language):**
```
Examples:
- "Show all pending MGT-7 due this week"
- "RBI filings waiting for client documents"
- "Assignments at risk of SLA breach"
- "My tasks for today"
- "Incorporation waiting for DSC collection"
```

#### C. Table Columns
| Column | Type | Use Case |
|--------|------|----------|
| Assignment ID | ID | Unique reference |
| Client | Text/Link | Quick client navigation |
| Type | Badge | Visual categorization |
| Stage | Status Badge | Current workflow phase |
| Progress % | Progress Bar | Overall completion |
| Pending Tasks | Count | Visual urgency |
| Due Date | Date | SLA indicator |
| Priority | Badge | Urgency signal |
| Owner | Avatar | Responsibility |
| Compliance Risk | Indicator | Risk scoring |
| Last Updated | Timestamp | Activity signal |

#### D. Actions
- **Bulk Actions**: Mark complete, reassign, change priority, add to bucket
- **Row Actions**: View, Edit, Clone, Archive, Delete
- **Quick Actions Menu**: (Cmd+K / Ctrl+K) Command palette

#### E. Saved Filters
- User-created filter combinations
- Shareable filter sets
- Team-wide filters (e.g., "Partner Review Queue")

---

### 2. Assignment Creation Flow

#### Stage 1: Select Client
```
Form: ClientSelect
- Search client by name/CIN
- Recent clients quick-pick
- Create new client (if permitted)
```

#### Stage 2: Select Assignment Type
```
Form: AssignmentTypeSelect
- Browse master templates
- Search by type name
- Quick favorites
- AI suggest (based on client history)
```

#### Stage 3: Auto-Generate Task List
```
System automatically populates:
1. All standard tasks from template
2. SLA deadlines (default + any adjustments)
3. Task dependencies
4. Required documents checklist
5. Suggested assignees (based on skills/availability)

User can:
- Edit task names
- Adjust deadlines
- Reorder tasks
- Add/remove tasks
- Configure dependencies
```

#### Stage 4: AI Recommendations
```
AI suggests:
{
  "timeline": "45 days (based on historical avg + client complexity)",
  "dependencies": [
    { "task": "DSC Collection", "blocks": ["MOA Drafting", "MOA Signing"] }
  ],
  "required_documents": ["PAN", "Aadhaar", "Proof of Address"],
  "suggested_team": [
    { "role": "drafting", "member": "Priya Sharma", "reason": "expertise" }
  ],
  "risk_factors": ["First-time client", "Foreign director"],
  "recommended_checkpoints": ["Day 5", "Day 15", "Day 30"]
}
```

#### Stage 5: Review & Create
```
Summary view:
- All tasks listed with dates
- Team assignments
- Documents required
- Key dates highlighted

Create button (saves assignment, sends notifications)
```

**UX Principle:** Entire flow should be completable in <5 minutes with keyboard shortcuts enabled.

---

### 3. Assignment Master Templates

#### Template Structure
```json
{
  "id": "INCORPORATION_V2",
  "name": "Company Incorporation",
  "version": "2.0",
  "description": "Complete PVT LTD company registration process",
  "category": "Incorporation",
  "regulatory_reference": "Companies Act 2013, ROC",
  "estimated_duration_days": 45,
  "complexity_level": "high",
  
  "tasks": [
    {
      "id": "T001",
      "name": "Name Reservation",
      "description": "Submit name with alternatives to ROC",
      "order": 1,
      "standard_duration_days": 3,
      "required_documents": ["Company Name List"],
      "responsibilities": ["ROC Filing Expert"],
      "checklist_items": [
        "Prepare 5 name options",
        "Check availability on MCA portal",
        "Submit Form 1A",
        "Receive ROC communication"
      ],
      "ai_prompts": {
        "next_action": "Prepare company name suggestions based on client business",
        "risk_assessment": "Check MCA database for conflicts"
      }
    },
    {
      "id": "T002",
      "name": "DSC Collection",
      "description": "Collect digital signature certificates from directors",
      "order": 2,
      "standard_duration_days": 7,
      "depends_on": ["T001"],
      "required_documents": [],
      "responsibilities": ["Executive"],
      "escalation_rule": "If not received by day X, escalate to partner"
    }
  ],
  
  "documents_required": [
    {
      "id": "DOC_PAN",
      "name": "Director PAN",
      "required": true,
      "description": "PAN certificate for all directors"
    }
  ],
  
  "approval_checkpoints": [
    {
      "stage": "name_approval",
      "description": "Partner approves name options",
      "reviewer": ["Partner"],
      "mandatory": true
    }
  ],
  
  "conditional_tasks": [
    {
      "condition": "if foreign_director exists",
      "tasks": ["FEMA Compliance", "FCRA Clearance"]
    }
  ],

  "auto_reminders": [
    { "days_before_due": 2, "channel": "email" }
  ]
}
```

#### Template Management
- **Versioning**: Track template evolution, allow rollback
- **Clone**: Create new template from existing
- **AI-Generated**: Create templates from documentation/requirements
- **Conditional Logic**: Tasks added/removed based on client/assignment attributes

---

### 4. Task Management

#### Task Status Lifecycle
```
Pending
  ├→ In Progress (assigned)
  ├→ Waiting for Client (blocked on client action)
  ├→ Under Review (submitted for approval)
  │   └→ Completed (approved)
  └→ Blocked (depends on other task)
```

#### Task Entity
```json
{
  "id": "TASK_UUID",
  "assignment_id": "ASG_UUID",
  "template_task_id": "T001",
  "name": "Name Reservation",
  "description": "Submit name with alternatives to ROC",
  "status": "in_progress",
  "priority": "high",
  "order": 1,
  
  "dates": {
    "created_at": "2026-05-12T10:00Z",
    "started_at": "2026-05-12T10:30Z",
    "due_date": "2026-05-15T17:00Z",
    "target_completion": "2026-05-14T17:00Z",
    "completed_at": null,
    "sla_breach": false
  },
  
  "assignment": {
    "assignee_id": "USER_UUID",
    "reviewer_id": "USER_UUID",
    "secondary_assignees": ["USER_UUID_2"]
  },
  
  "dependencies": {
    "blocks": ["T002", "T003"],
    "blocked_by": []
  },
  
  "checklist": [
    { "id": "CL1", "item": "Prepare 5 name options", "completed": true },
    { "id": "CL2", "item": "Check MCA availability", "completed": true },
    { "id": "CL3", "item": "Submit Form 1A", "completed": false }
  ],
  
  "documents": [
    {
      "id": "DOC_UUID",
      "name": "Name Verification Form",
      "type": "required",
      "status": "uploaded"
    }
  ],
  
  "approvals": [
    {
      "stage": "review",
      "reviewer_id": "USER_UUID",
      "status": "pending",
      "created_at": "2026-05-14T15:00Z"
    }
  ],
  
  "time_tracking": {
    "estimated_hours": 5,
    "logged_hours": 3.5,
    "remaining_hours": 1.5
  },
  
  "ai_notes": {
    "next_action_suggestion": "Upload name verification to MCA portal",
    "risk_assessment": "On track for SLA"
  },
  
  "activity": [
    {
      "timestamp": "2026-05-12T10:30Z",
      "actor": "USER_UUID",
      "action": "started_task",
      "details": {}
    }
  ]
}
```

#### Task Actions
- **Start/Pause/Resume**: Control active work
- **Complete**: Mark done (with optional approval gate)
- **Add Subtask**: Break into smaller pieces
- **Add Checklist**: Define completion criteria
- **Add Comment**: Discussion thread
- **Attach Document**: Link evidence
- **Request Approval**: Escalate for review
- **Reassign**: Transfer ownership
- **Request Help**: Tag collaborators
- **Add Time Entry**: Log hours for billing

#### Task Features
- **Recurring Tasks**: Daily/Weekly/Monthly execution
- **Auto-escalation**: If SLA approaching, escalate
- **Dependency Graph**: Visual task network
- **Time Tracking**: Billable hours tracking
- **Activity Log**: Complete audit trail

---

### 5. Document Collection System

#### Document Tracker
```json
{
  "assignment_id": "ASG_UUID",
  "documents_required": [
    {
      "id": "DOC_PAN",
      "name": "Director PAN Certificate",
      "type": "identity",
      "required": true,
      "status": "pending",
      "collected_by": null,
      "collected_at": null,
      "collected_from": "director",
      "reminder_sent": false,
      "notes": ""
    },
    {
      "id": "DOC_AADHAAR",
      "name": "Director Aadhaar",
      "type": "identity",
      "required": true,
      "status": "submitted",
      "collected_by": "USER_UUID",
      "collected_at": "2026-05-13T14:30Z",
      "file_url": "s3://...",
      "ocr_extracted": {
        "successful": true,
        "data": {
          "name": "Rajesh Kumar",
          "uid": "123456789012",
          "address": "..."
        }
      }
    }
  ]
}
```

#### Collection Channels
- **Email Link**: Send secure link for upload
- **WhatsApp**: Quick link via WhatsApp
- **Google Drive**: Direct integration
- **Portal**: Client login to upload
- **Manual Upload**: Team uploads on behalf

#### Features
- **Smart Reminders**: Escalate if not received
- **OCR Extraction**: Auto-extract data from documents
- **Verification**: Flag missing or incomplete documents
- **Auto-Tagging**: Categorize documents automatically
- **Storage**: Secure S3/Drive integration

---

### 6. AI Features & Copilot

#### AI Assistant Sidebar
```
Location: Right sidebar on assignment detail page

Features:
1. **Context-Aware Chat**
   - Ask questions about assignment
   - Get task recommendations
   - AI reviews progress
   - Suggest next steps

2. **Document Intelligence**
   - "Extract PAN from Aadhaar"
   - "Check if all docs are present"
   - "Flag missing documents"
   - "Summarize uploaded documents"

3. **Timeline Intelligence**
   - "Predict completion date"
   - "Identify SLA risks"
   - "Suggest priority shifts"
   - "Rebalance team workload"

4. **Task Generation**
   - "Add FEMA compliance tasks"
   - "Create reminder sequence"
   - "Generate task checklist"

5. **Communication Drafts**
   - "Draft client follow-up email"
   - "Create task description from notes"
   - "Generate status update"

6. **Risk Assessment**
   - "Compliance risk score: 7/10"
   - "Reasons: Foreign director, short timeline"
   - "Recommended mitigations"
```

#### AI Capabilities

**1. Document Processing**
```
Input: PDF/Image file
Process:
- OCR extraction
- Data validation
- Field mapping

Output: {
  "document_type": "aadhaar",
  "extracted_data": {
    "name": "...",
    "dob": "...",
    "address": "..."
  },
  "confidence": 0.95,
  "missing_fields": [],
  "issues": []
}
```

**2. Timeline Prediction**
```
Model Input:
- Assignment type
- Client profile (new/repeat, complexity)
- Team availability
- Historical data

Output: {
  "predicted_duration_days": 42,
  "confidence": 0.87,
  "risk_factors": ["foreign_director", "pending_documents"],
  "milestone_dates": [
    { "name": "Name approved", "days": 3 },
    { "name": "DSC collected", "days": 10 }
  ]
}
```

**3. Next Action AI**
```
System analyzes:
- Current assignment state
- Task dependencies
- Document status
- Team availability

Suggests: {
  "immediate_action": "Request DSC from directors email",
  "reason": "Unblocks 3 downstream tasks",
  "estimated_time_impact": "Days saved: 5-7"
}
```

**4. Compliance Risk Scoring**
```python
RISK_SCORE = (
  (document_completion_pct * 0.3) +
  (timeline_risk_pct * 0.3) +
  (team_workload_pct * 0.2) +
  (approval_status * 0.2)
)

Output: {
  "risk_score": 7,  // 1-10 scale
  "status": "high",
  "contributing_factors": [
    "60% documents collected",
    "3 days to SLA breach",
    "Reviewer unavailable"
  ],
  "recommended_actions": [...]
}
```

---

### 7. Assignment Detail Page

#### Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│  Assignment: CORP-2026-001234 | Incorporation - Acme Ltd | URGENT │
│  [Back] [Share] [Archive] [...]                                    │
├────────────────────┬────────────────────────┬──────────────────────┤
│ LEFT PANEL         │ CENTER CONTENT         │ RIGHT SIDEBAR        │
│ (20% width)        │ (60% width)            │ AI Copilot (20%)    │
│                    │                        │                      │
│ ASSIGNMENT INFO    │ TABS:                  │ Context-aware        │
│ ────────────────   │ • Overview (active)    │ AI assistant         │
│ • Client: Acme     │ • Timeline             │                      │
│ • Type: Corp.Inc   │ • Tasks                │ Quick actions:       │
│ • Status: In Prog  │ • Documents            │ • Extract docs       │
│ • Owner: Priya     │ • Activity             │ • Predict timeline   │
│ • Priority: High   │ • Billing              │ • Draft email        │
│ • Due: May 20      │ • Audit Log            │ • Check risk         │
│                    │                        │                      │
│ TEAM              │ TAB CONTENT:           │ Chat for context     │
│ ────────────────   │ Status cards           │ Q/A                  │
│ 👤 Priya (owner)   │ Progress bars          │                      │
│ 👤 Rajesh (draft)  │ Timeline visualization │ Suggestions:         │
│ 👤 Amit (review)   │ Task list              │ [AI suggestions]     │
│                    │ Dependencies graph     │                      │
│ QUICK ACTIONS      │ Document checklist     │                      │
│ ────────────────   │                        │                      │
│ [Add Task]         │ Pending items badges   │                      │
│ [Upload Doc]       │                        │                      │
│ [Request Approval] │                        │                      │
│ [View Timeline]    │                        │                      │
│ [Bulk Actions]     │                        │                      │
└────────────────────┴────────────────────────┴──────────────────────┘

STICKY FOOTER:
┌─────────────────────────────────────────────────────────────────────┐
│ [Status] [Assign] [Priority] [Due Date] ... [Complete Assignment]  │
└─────────────────────────────────────────────────────────────────────┘
```

#### Overview Tab Content
```
Section 1: STATUS CARDS
┌─────────────┬──────────────┬──────────────┬──────────────┐
│ Tasks       │ Documents    │ Approvals    │ Risk Score   │
│ 8/12 — 67%  │ 5/8 — 63%    │ 2/2 Pending  │ 7/10 (HIGH)  │
└─────────────┴──────────────┴──────────────┴──────────────┘

Section 2: ASSIGNMENT TIMELINE
┌─────────────────────────────────────────────────────────────┐
│ Estimated: 45 days | Elapsed: 8 days | Remaining: 37 days │
│ ╔═══════════════════════════════════════════════════════╗   │
│ ║ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║   │
│ ║ May 12          May 20          Jun 1          Jun 26   ║   │
│ ╚═══════════════════════════════════════════════════════╝   │
│ Today: May 12 | SLA Due: Jun 26                             │
└─────────────────────────────────────────────────────────────┘

Section 3: KEY METRICS
• Compliance Risk: High (due to foreign director)
• Team Capacity: At 85%
• Budget Used: ₹42,000 / ₹50,000
• Days to SLA Breach: 45 days
```

#### Timeline Tab
```
Dependency graph visualization:

┌─────────────────┐
│  Name Reserve   │ (Day 0-3)
│  (Completed)    │
└────────┬────────┘
         ↓
    ┌────────────────┬────────────────┐
    ↓                ↓                ↓
┌─────────┐   ┌──────────────┐   ┌─────────────┐
│ PAN     │   │ MOA Drafting │   │ Approval    │
│ Collect │   │ (In Progress)│   │ (Pending)   │
│ (Done)  │   └──────────────┘   └─────────────┘
└─────────┘
```

#### Tasks Tab
```
Table View with Options:
┌────┬──────────┬────────┬───────────┬──────┬──────────┬────────┐
│ ID │ Task     │ Status │ Assignee  │ Days │ Priority │ Action │
├────┼──────────┼────────┼───────────┼──────┼──────────┼────────┤
│ 1  │ Name Res │ ✓ Done │ Priya     │ 3    │ High     │ ⋯      │
│ 2  │ PAN Coll │ ✓ Done │ Rajesh    │ 7    │ High     │ ⋯      │
│ 3  │ DSC Coll │ ⚠ WAIT │ Rajesh    │ 7    │ High     │ ⋯      │
│ 4  │ MOA Dft  │ ● Prog │ Priya     │ 5    │ Medium   │ ⋯      │
│ 5  │ Approval │ ⧗ Pend │ Manager   │ 2    │ High     │ ⋯      │
└────┴──────────┴────────┴───────────┴──────┴──────────┴────────┘

Row Click: Expand task details
Task Details Modal:
- Full description
- Checklist items
- Comments
- Attachments
- Activity log
- Related tasks
```

#### Documents Tab
```
REQUIRED DOCUMENTS CHECKLIST:
┌────────────────────────────────────────────────────────────┐
│ ☑ Director PAN (Collected)                                 │
│   Collected by: Rajesh | Date: May 13 | File: pan.pdf     │
│   Extracted: Name, PAN, Address ✓                         │
│                                                             │
│ ☑ Director Aadhaar (Collected)                             │
│   Collected by: Amit | Date: May 12 | File: aadhaar.pdf  │
│   Extracted: Name, UID, Address ✓                         │
│                                                             │
│ ☐ MOA Document (Pending)                                   │
│   [Send Reminder] [Upload Manual] [Track Status]           │
│   Reminder sent: 1 time | Last: May 14                     │
│                                                             │
│ ☐ Board Resolution (Missing)                               │
│   [Request] [Upload] [Help]                                │
└────────────────────────────────────────────────────────────┘

UPLOADED DOCUMENTS:
[Filters: All, Identity, Financial, Legal]

Grid:
[Icon] name.pdf — 2.4 MB
Updated: May 13 | Uploaded by: Rajesh
[View] [Download] [Extract] [Verify] [...]
```

---

## Database Schema

### Core Entities

```sql
-- ASSIGNMENTS
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id),
  template_id UUID NOT NULL REFERENCES assignment_templates(id),
  assignment_number VARCHAR(50) UNIQUE NOT NULL,  -- ASG-2026-001234
  
  -- Metadata
  name VARCHAR(255),
  description TEXT,
  status assignment_status NOT NULL DEFAULT 'pending',  -- pending, in_progress, waiting_for_client, under_review, completed, blocked, cancelled
  priority priority_level NOT NULL DEFAULT 'medium',  -- low, medium, high, critical
  
  -- Assignment Info
  owner_id UUID NOT NULL REFERENCES users(id),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Timeline
  started_at TIMESTAMP,
  target_completion_date DATE NOT NULL,
  sla_days INTEGER,
  actual_completion_date TIMESTAMP,
  
  -- Custom Fields
  custom_metadata JSONB,
  
  -- Audit
  archived_at TIMESTAMP,
  is_archived BOOLEAN DEFAULT FALSE,
  
  INDEX (client_id, status),
  INDEX (owner_id, created_at),
  INDEX (target_completion_date)
);

-- ASSIGNMENT TEMPLATES
CREATE TABLE assignment_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Metadata
  template_code VARCHAR(50) UNIQUE NOT NULL,  -- INCORPORATION_V2
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,  -- Incorporation, MGT-7, DIR-3, etc.
  
  -- Version Control
  version VARCHAR(20) NOT NULL DEFAULT '1.0',
  parent_template_id UUID REFERENCES assignment_templates(id),
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Content
  tasks_definition JSONB NOT NULL,  -- Array of task templates
  documents_required JSONB,  -- Array of required documents
  approval_workflow JSONB,
  conditional_rules JSONB,  -- Conditional task logic
  ai_prompts JSONB,
  
  -- Timing
  estimated_duration_days INTEGER,
  sla_days INTEGER,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  
  -- Regulatory Info
  regulatory_reference VARCHAR(500),
  complexity_level VARCHAR(20),  -- low, medium, high
  
  INDEX (category, is_active),
  INDEX (created_at)
);

-- TASKS
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  template_task_id VARCHAR(50),  -- Reference to template task
  
  -- Task Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'pending',  -- pending, in_progress, waiting_for_client, under_review, completed, blocked
  priority priority_level DEFAULT 'medium',
  order_in_assignment SMALLINT,
  
  -- Assignment
  assignee_id UUID REFERENCES users(id),
  reviewer_id UUID REFERENCES users(id),
  secondary_assignees UUID[] DEFAULT ARRAY[]::UUID[],
  
  -- Timeline
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  due_date DATE NOT NULL,
  target_completion_date DATE,
  completed_at TIMESTAMP,
  estimated_hours DECIMAL(8,2),
  
  -- Dependencies
  blocks_tasks UUID[] DEFAULT ARRAY[]::UUID[],
  blocked_by_tasks UUID[] DEFAULT ARRAY[]::UUID[],
  
  -- Checklist
  checklist_items JSONB,  -- Array of checklist items: {id, item, completed}
  
  -- SLA
  sla_hours INTEGER,
  sla_breach_at TIMESTAMP,
  
  -- Metadata
  custom_metadata JSONB,
  
  INDEX (assignment_id, status),
  INDEX (assignee_id, due_date),
  INDEX (due_date)
);

-- TASK ATTACHMENTS / DOCUMENTS
CREATE TABLE task_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  
  -- File Info
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,  -- S3 URL
  file_size_bytes BIGINT,
  file_type VARCHAR(50),  -- pdf, image, docx, etc.
  
  -- Document Classification
  document_category VARCHAR(100),  -- identity, financial, legal, etc.
  document_type_id UUID REFERENCES document_types(id),
  
  -- OCR & Extraction
  ocr_available BOOLEAN DEFAULT FALSE,
  ocr_data JSONB,  -- {name, address, id_number, etc.}
  ocr_confidence DECIMAL(3,2),
  extraction_errors TEXT[],
  
  -- Status
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  
  uploaded_by UUID NOT NULL REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  
  INDEX (assignment_id, document_type_id),
  INDEX (uploaded_at)
);

-- ASSIGNMENT DOCUMENTS (REQUIRED)
CREATE TABLE assignment_document_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  
  -- Requirement
  document_name VARCHAR(255) NOT NULL,
  document_type_id UUID REFERENCES document_types(id),
  is_required BOOLEAN DEFAULT TRUE,
  
  -- Collection Status
  status document_collection_status DEFAULT 'pending',  -- pending, submitted, verified, collected
  collected_by UUID REFERENCES users(id),
  collected_at TIMESTAMP,
  collected_from VARCHAR(100),  -- director, client, goir, etc.
  
  -- Reminders
  first_reminder_sent BOOLEAN DEFAULT FALSE,
  first_reminder_at TIMESTAMP,
  second_reminder_sent BOOLEAN DEFAULT FALSE,
  second_reminder_at TIMESTAMP,
  escalation_level SMALLINT DEFAULT 0,
  
  -- Linked Document
  document_id UUID REFERENCES task_documents(id),
  
  notes TEXT,
  
  INDEX (assignment_id, status),
  INDEX (collected_at)
);

-- TASK DEPENDENCIES
CREATE TABLE task_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_from_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  task_to_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  
  -- Dependency Type
  dependency_type dependency_type NOT NULL,  -- blocks, depends_on, related
  
  -- Condition
  condition_logic JSONB,  -- Optional: conditional dependency logic
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(task_from_id, task_to_id, dependency_type),
  INDEX (task_from_id, dependency_type)
);

-- APPROVALS
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  
  -- Approval Info
  approval_stage VARCHAR(100) NOT NULL,  -- review, legal_check, partner_approval, etc.
  status approval_status NOT NULL DEFAULT 'pending',  -- pending, approved, rejected, needs_revision
  
  -- Reviewer Assignment
  reviewer_id UUID NOT NULL REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  
  -- Review Details
  reviewed_at TIMESTAMP,
  reviewed_by_user_id UUID REFERENCES users(id),
  feedback TEXT,
  revision_count SMALLINT DEFAULT 0,
  
  -- Escalation
  escalated_to UUID REFERENCES users(id),
  escalation_reason VARCHAR(255),
  escalated_at TIMESTAMP,
  
  INDEX (assignment_id, status),
  INDEX (reviewer_id, status),
  INDEX (assigned_at)
);

-- ACTIVITY LOG
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  
  -- Activity
  actor_id UUID NOT NULL REFERENCES users(id),
  action action_type NOT NULL,  -- created, started, completed, approved, etc.
  entity_type VARCHAR(50),  -- assignment, task, document, etc.
  entity_id UUID,
  
  -- Changes
  changes_before JSONB,
  changes_after JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX (assignment_id, created_at),
  INDEX (actor_id, created_at)
);

-- AI INSIGHTS
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  
  -- Insight Metadata
  insight_type insight_type NOT NULL,  -- risk_assessment, next_action, timeline_prediction, etc.
  insight_category VARCHAR(100),
  
  -- Content
  insight_data JSONB NOT NULL,  -- {score, factors, recommendations, etc.}
  confidence_score DECIMAL(3,2),
  
  -- Timing
  generated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Model Info
  model_name VARCHAR(100),
  model_version VARCHAR(20),
  
  INDEX (assignment_id, insight_type, is_active),
  INDEX (generated_at)
);

-- ENUMS
CREATE TYPE assignment_status AS ENUM (
  'pending',
  'in_progress',
  'waiting_for_client',
  'under_review',
  'completed',
  'blocked',
  'cancelled'
);

CREATE TYPE task_status AS ENUM (
  'pending',
  'in_progress',
  'waiting_for_client',
  'under_review',
  'completed',
  'blocked'
);

CREATE TYPE document_collection_status AS ENUM (
  'pending',
  'submitted',
  'verified',
  'collected'
);

CREATE TYPE approval_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'needs_revision'
);

CREATE TYPE priority_level AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TYPE dependency_type AS ENUM (
  'blocks',
  'depends_on',
  'related'
);

CREATE TYPE action_type AS ENUM (
  'created',
  'started',
  'in_progress',
  'completed',
  'approved',
  'rejected',
  'task_added',
  'task_removed',
  'status_changed',
  'assigned',
  'reassigned',
  'commented',
  'document_uploaded',
  'approval_requested'
);

CREATE TYPE insight_type AS ENUM (
  'risk_assessment',
  'next_action_suggestion',
  'timeline_prediction',
  'compliance_alert',
  'team_workload_alert',
  'document_status_update',
  'sla_warning'
);

-- ADDITIONAL TABLES

CREATE TABLE document_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(100),
  icon_name VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE team_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  role VARCHAR(100),  -- owner, reviewer, contributor
  
  UNIQUE(assignment_id, user_id)
);
```

---

## API Design

### Base URL
```
https://api.suitsin.com/v1
```

### Authentication
```
Bearer {JWT_TOKEN}
```

### Core Endpoints

#### ASSIGNMENTS

```
GET /assignments
Query Params:
  - status: "in_progress,pending"
  - priority: "high,critical"
  - client_id: "uuid"
  - owner_id: "uuid"
  - due_date_from: "2026-05-15"
  - due_date_to: "2026-05-31"
  - page: 1
  - limit: 20
  - sort: "due_date,-priority"
  - view: "table,kanban,calendar"

Response:
{
  "data": [
    {
      "id": "uuid",
      "assignment_number": "ASG-2026-001234",
      "client": { "id", "name" },
      "type": { "id", "name" },
      "status": "in_progress",
      "priority": "high",
      "owner": { "id", "name", "avatar" },
      "progress_percent": 67,
      "pending_tasks_count": 4,
      "due_date": "2026-05-20",
      "created_at": "2026-05-12T10:00Z",
      "risk_score": 7
    }
  ],
  "pagination": { "total": 245, "page": 1, "limit": 20 },
  "filters": { "active_filters": [...] }
}
```

```
POST /assignments
Body:
{
  "client_id": "uuid",
  "template_id": "uuid",
  "name": "Incorporation - Acme Ltd",
  "owner_id": "uuid",
  "target_completion_date": "2026-06-26",
  "priority": "high",
  "custom_metadata": {}
}

Response: { Assignment object + assigned tasks }
```

```
GET /assignments/{id}
Response: { Full assignment detail with all relations }
```

```
PATCH /assignments/{id}
Body:
{
  "status": "in_progress",
  "priority": "high",
  "owner_id": "uuid",
  "target_completion_date": "2026-06-26"
}
```

```
DELETE /assignments/{id}
```

```
POST /assignments/{id}/archive
```

#### TASKS

```
GET /assignments/{id}/tasks
Response: [Task array with nested dependencies, checklist]
```

```
POST /assignments/{id}/tasks
Body:
{
  "name": "Name Reservation",
  "description": "...",
  "assignee_id": "uuid",
  "due_date": "2026-05-15",
  "priority": "high",
  "estimated_hours": 5,
  "blocks_tasks": ["uuid1", "uuid2"]
}
```

```
PATCH /assignments/{assignment_id}/tasks/{task_id}
Body:
{
  "status": "in_progress",
  "assignee_id": "uuid",
  "priority": "medium"
}
```

```
POST /assignments/{assignment_id}/tasks/{task_id}/start
```

```
POST /assignments/{assignment_id}/tasks/{task_id}/complete
Body:
{
  "notes": "Task completed with all deliverables"
}
```

#### DOCUMENTS

```
GET /assignments/{id}/documents
Response: [Documents with extraction data]
```

```
POST /assignments/{id}/documents
Body: multipart/form-data
{
  "file": <binary>,
  "document_category": "identity",
  "document_type_id": "uuid"
}

Response:
{
  "id": "uuid",
  "file_url": "s3://...",
  "ocr_available": true,
  "ocr_data": {}
}
```

```
POST /assignments/{id}/document-requirements/{doc_id}/collect
Body:
{
  "collected_by": "uuid",
  "collected_from": "director"
}
```

```
POST /assignments/{id}/document-requirements/{doc_id}/send-reminder
```

#### APPROVALS

```
GET /assignments/{id}/approvals
Response: [Approval array with reviewer info]
```

```
POST /assignments/{id}/approvals
Body:
{
  "task_id": "uuid",
  "approval_stage": "partner_review",
  "reviewer_id": "uuid"
}
```

```
PATCH /assignments/{id}/approvals/{approval_id}
Body:
{
  "status": "approved",
  "feedback": "Looks good, proceeding"
}
```

#### AI ENDPOINTS

```
POST /assignments/{id}/ai/next-action
Response:
{
  "action": "Request DSC from director",
  "reason": "Unblocks 3 downstream tasks",
  "time_impact": "Saves 5-7 days",
  "confidence": 0.92
}
```

```
POST /assignments/{id}/ai/risk-assessment
Response:
{
  "risk_score": 7,
  "status": "high",
  "factors": [...],
  "recommendations": [...]
}
```

```
POST /assignments/{id}/ai/timeline-prediction
Response:
{
  "predicted_days": 42,
  "confidence": 0.87,
  "milestones": [...]
}
```

```
POST /assignments/{id}/ai/document-analysis
Body:
{
  "document_id": "uuid"
}
Response:
{
  "extracted_data": {...},
  "validation_status": "complete",
  "confidence": 0.95
}
```

```
POST /assignments/{id}/ai/chat
Body:
{
  "message": "What's the next best action?",
  "context_type": "assignment_overview"
}
Response:
{
  "response": "Based on current status...",
  "suggestions": [...]
}
```

#### TEMPLATES

```
GET /assignment-templates
Query Params:
  - category: "incorporation"
  - is_active: true
  - page: 1

Response: [Template array]
```

```
GET /assignment-templates/{id}
Response: { Full template with tasks, docs, workflow }
```

```
POST /assignment-templates
Body: { Template definition }
```

```
POST /assignment-templates/{id}/clone
Body:
{
  "new_name": "Incorporation V3"
}
```

---

## UX/UI Architecture

### Design Tokens

**Color Palette:**
```
Primary: #0066FF (Deep Blue)
Secondary: #7C3AED (Violet)
Success: #10B981 (Green)
Warning: #F59E0B (Amber)
Danger: #EF4444 (Red)
Background: #FFFFFF
Surface: #F9FAFB
Text Primary: #111827
Text Secondary: #6B7280
Border: #E5E7EB
```

**Typography:**
```
Headings: Inter, 600 weight
Body: Inter, 400 weight
Mono: JetBrains Mono for codes/references
```

**Spacing System:**
```
4px, 8px, 12px, 16px, 24px, 32px, 48px
```

### Main Page Layout

#### `/assignments` List View

```
╔════════════════════════════════════════════════════════════════════╗
║ Assignments / Active                                   [Search...] ║
╠════════════════════════════════════════════════════════════════════╣
║ [Filters ▼]  Status: All  Client: All  Priority: All             ║
║ [Save Filter] [Saved Filters ▼] [Kanban] [Calendar] [Export]    ║
╠════════════════════════════════════════════════════════════════════╣
║ ☑ │ ASG  │ Client │ Type  │ Stage    │ Progress │ Due │ Pri │ Own║
╟────┼──────┼────────┼───────┼──────────┼──────────┼─────┼─────┼────╢
║   │1234  │ Acme   │Inc    │ In Prog  │ ████░░░ │May20│High │Pri║
║   │1235  │ Beta   │MGT-7  │ Waiting  │ ██░░░░░ │May18│Crit │Raj║
║   │1236  │ Gamma  │DIR-3  │ Pending  │ ░░░░░░░ │Jun5 │Med  │Ami║
╚════════════════════════════════════════════════════════════════════╝

BOTTOM PANEL:
[Bulk Actions ▼] [Archive] [Reassign] [Priority] [Due Date]
```

#### `/assignments/{id}` Detail Page

```
┌──────────────────────────────────────────────────────────────────────┐
│ ◄ Assignments / ASG-2026-001234 | Incorporation - Acme Ltd           │
├─────────────┬─────────────────────────────────┬──────────────────────┤
│             │                                 │ AI Copilot           │
│  SIDEBAR    │  MAIN CONTENT                   │ ────────────────────│
│  ────────   │  ────────────────               │                      │
│             │  [Overview] [Timeline] [Tasks]  │ Context Summary:     │
│ Status:     │  [Documents] [Activity]         │                      │
│ In Progress │                                 │ Assignment Status    │
│             │  OVERVIEW TAB:                  │ Progress: 67%        │
│ Owner:      │  ┌────────────────────────────┐ │ Days Left: 14        │
│ Priya ✓     │  │ Progress & Metrics         │ │                      │
│             │  │ ████░░░░░░ 67%             │ │ Pending Items:       │
│ Dates:      │  │                            │ │ • DSC collection     │
│ Due: May 26 │  │ Tasks: 8/12 ✓              │ │ • MOA draft          │
│ @ 17:00     │  │ Documents: 5/8 ✓           │ │ • Approval review    │
│             │  │ Approvals: 1/2 ◀ Pending   │ │                      │
│ Team:       │  │ Risk Score: 7/10 (HIGH)    │ │ Suggestions:         │
│ 👤 Pri      │  │                            │ │ ─────────────────│
│ 👤 Raj      │  │ Timeline Estimate:         │ │                      │
│ 👤 Ami      │  │ Started: 8 days ago        │ │ 1. Request DSC asap  │
│             │  │ Elapsed: 38% of time       │ │    (Unblocks PAN)    │
│ [Add Task]  │  │ Budget: ₹42k / ₹50k ✓     │ │                      │
│ [Upload]    │  │                            │ │ 2. Follow up MOA     │
│ [Approve]   │  └────────────────────────────┘ │    drafting status   │
│ [View PDF]  │                                 │                      │
│ [Settings]  │  TIMELINE TAB:                  │ [Ask Question ↓]     │
│             │  ┌─ Day 0 ─┬─ Day 10 ─┬─ Day30─┐ │                      │
│             │  │ Name ✓   │ PAN ✓    │ MOA Drf│ │ Chat History:        │
│             │  │ Reserve  │ Collect  │ In Pr  │ │ Q: Next action?      │
│             │  │ ✓ DONE   │ ✓ DONE   │ ⏳ 30% │ │ A: Request DSC...    │
│             │  │          │          │\       │ │ Q: Timeline impact?  │
│             │  │          │          │ \      │ │ A: 5-7 days saved...│
│             │  └──────────┴──────────┴ ───────┘ │                      │
│             │  (Dependency graph visualization) │                      │
│             │                                 │                      │
└─────────────┴─────────────────────────────────┴──────────────────────┘

STICKY FOOTER:
┌──────────────────────────────────────────────────────────────────────┐
│ Status: [In Progress ▼] | Owner: [Priya ▼] | Priority: [High ▼]   │
│ Due: [May 26 ▼] | [Complete Assignment] [Archive] [More...]         │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Library

**Key Components:**
- `<AssignmentCard />` - Compact assignment preview
- `<TaskRow />` - Table row with inline editing
- `<Kanban Board />` - Drag-drop status columns
- `<ProgressBar />` - Visual completion percentage
- `<TimeLine />` - Task timeline with dependencies
- `<DocumentUpload />` - Drag-drop file uploader
- `<ApprovalFlow />` - Status indicator + actions
- `<AIAssistant />` - Sidebar copilot chat interface
- `<RiskScore />` - Color-coded risk visualization
- `<Checklist />` - Interactive task checklist

---

## State Machine & Workflows

### Assignment Lifecycle State Machine

```
┌─ PENDING (Initial) ─────────┐
│     [Start]                 │
│        ↓                    │
│  IN_PROGRESS ◄──┐           │
│   (Team working)│ [Resume]  │
│     ↓          │           │
├─ WAITING_FOR_CLIENT ──────┐ │
│ (Blocked on client action) │ │
│     ↓                      │ │
│  [Client responds]         │ │
│ (Resume to IN_PROGRESS) ◄──┘ │
│     ↓                        │
├─ UNDER_REVIEW ────────────┐ │
│ (Awaiting approval)        │ │
│  ├─ [Approved]            │ │ [Reject]
│  │    ↓                   │ │    ↓
│  │ COMPLETED              │ └──[Revise]
│  │ (Final State)          │
│  └─ [Needs Revision] ─────┘
│
└─ BLOCKED
  └─ [Unblock] → IN_PROGRESS
  
└─ CANCELLED (Final State)
```

### Task Status Flow

```
Task Creation:
PENDING
  ├─ [Start] → IN_PROGRESS
  ├─ [On client] → WAITING_FOR_CLIENT
  │   └─ [Client provides] → IN_PROGRESS
  ├─ [Submit for review] → UNDER_REVIEW
  │   ├─ [Approved] → COMPLETED
  │   ├─ [Rejected] → IN_PROGRESS (revise)
  │   └─ [Needs revision] → IN_PROGRESS
  └─ [Dependency incomplete] → BLOCKED
      └─ [Dependency complete] → PENDING or IN_PROGRESS
```

### Conditional Task Generation Logic

```python
class ConditionalTaskLogic:
    """Generates tasks based on assignment attributes"""
    
    def generate_tasks(assignment, template):
        tasks = []
        
        # Always add base tasks
        tasks.extend(template.base_tasks)
        
        # Conditional logic
        if assignment.foreign_director_exists:
            tasks.extend([
                "FEMA Compliance Check",
                "FCRA Clearance (if applicable)",
                "Foreign Exchange Approval"
            ])
        
        if assignment.is_nidhi_nbc:
            tasks.extend([
                "NIDHI/NBC Approval",
                "RBI Pre-approval"
            ])
        
        if assignment.has_complex_shareholding:
            tasks.extend([
                "Shareholding Pattern Analysis",
                "Anti-dilution Review"
            ])
        
        # Time-based conditions
        if assignment.urgency_level == "CRITICAL":
            adjust_timeline(tasks, 0.7)  # Reduce SLA to 70%
        
        return tasks
```

### Approval Workflow

```
Assignment Approval Pipeline:

[Task Submitted]
      ↓
[Legal Review by Manager]
  ├─ Approved → [Status: Legal OK]
  │              ↓
  └─ Rejected → [Reassign for revision]
                      ↓
[Partner Final Review]
  ├─ Approved → [COMPLETED]
  ├─ Rejected → [Back to Legal]
  └─ Needs Info → [Request clarification]
```

### Document Collection Reminder Escalation

```
Day 1: Document marked "pending"
Day 3: First reminder via email + in-app
Day 7: Second reminder (escalate to manager)
Day 14: Third reminder + escalate to partner
Day 21: Auto-escalate to client call/WhatsApp
```

---

## AI Integration Design

### LLM-Based Orchestration
```
Using: LangGraph for workflow orchestration
LLM: OpenAI GPT-4 / Gemini Pro with function calling

Agents:
1. DocumentAnalysisAgent - OCR, extraction, validation
2. TimelinePredictionAgent - Duration estimation
3. NextActionAgent - Workflow recommendation
4. ComplianceRiskAgent - Risk assessment
5. ClientCommunicationAgent - Email/message drafting
```

### AI Pipeline Architecture

```python
@app.post("/assignments/{id}/ai/process-full")
async def process_assignment_with_ai(assignment_id: str):
    """
    Runs complete AI analysis on assignment
    """
    assignment = get_assignment(assignment_id)
    
    # Step 1: Document Intelligence
    doc_insights = await DocumentAnalysisAgent.process(
        documents=assignment.documents,
        expected_fields=assignment.template.required_fields
    )
    
    # Step 2: Timeline Analysis
    timeline_prediction = await TimelinePredictionAgent.predict(
        assignment_type=assignment.template_id,
        client_complexity=assignment.client.historical_complexity,
        team_capacity=get_team_capacity(),
        documents_status=doc_insights
    )
    
    # Step 3: Risk Assessment
    risk_score = await ComplianceRiskAgent.assess(
        assignment=assignment,
        timeline_confidence=timeline_prediction.confidence,
        document_status=doc_insights,
        sla_days=assignment.sla_days
    )
    
    # Step 4: Next Action Suggestion
    next_actions = await NextActionAgent.suggest(
        assignment=assignment,
        risk_score=risk_score,
        pending_items=get_pending_items(assignment)
    )
    
    # Step 5: Store Insights
    insights = [
        AIInsight(
            assignment_id=assignment_id,
            type="document_analysis",
            data=doc_insights
        ),
        AIInsight(
            assignment_id=assignment_id,
            type="timeline_prediction",
            data=timeline_prediction
        ),
        # ... more insights
    ]
    
    await db.save_insights(insights)
    
    return {
        "documents": doc_insights,
        "timeline": timeline_prediction,
        "risk": risk_score,
        "next_actions": next_actions
    }
```

### Document Processing Pipeline

```
Input Document
      ↓
[OCR with Tesseract/Google Vision]
      ↓
[Extract Text & Layout]
      ↓
[Use GPT-4V to identify document type]
  - PAN/Aadhaar/MOA/COI/etc.
      ↓
[Field Extraction via Structured Output]
  {
    "name": "...",
    "id": "...",
    "dob": "...",
    "confidence": 0.95
  }
      ↓
[Validation]
  - Cross-check with MCA if CIN
  - Validate PAN format
      ↓
[Auto-tag & Store with Metadata]
```

### Compliance Risk Scoring Algorithm

```python
class ComplianceRiskScorer:
    """
    Calculates compliance risk: 1-10 (low to high)
    """
    
    WEIGHTS = {
        'document_completion': 0.30,
        'timeline_risk': 0.30,
        'team_capacity': 0.20,
        'approval_status': 0.15,
        'client_risk': 0.05
    }
    
    def calculate(self, assignment):
        scores = {}
        
        # Document Completion Score
        docs_collected = len([d for d in assignment.documents if d.verified])
        docs_required = len(assignment.docs_required)
        completion_pct = docs_collected / max(docs_required, 1)
        scores['document_completion'] = (1 - completion_pct) * 10
        
        # Timeline Risk
        days_remaining = (assignment.due_date - today()).days
        days_used = (today() - assignment.created_at).days
        estimated_days = self.predict_remaining_days(assignment)
        
        if estimated_days > days_remaining:
            timeline_risk = (estimated_days - days_remaining) / estimated_days * 10
        else:
            timeline_risk = 0
        scores['timeline_risk'] = timeline_risk
        
        # Team Capacity
        team_workload = calculate_team_workload(assignment.team)
        scores['team_capacity'] = (team_workload / 100) * 5  # Max 5 points
        
        # Approval Status
        pending_approvals = len([a for a in assignment.approvals if a.status == 'pending'])
        scores['approval_status'] = pending_approvals * 2
        
        # Client Risk (first-time, new type, etc.)
        client_risk = self.calculate_client_risk(assignment.client)
        scores['client_risk'] = client_risk
        
        # Weighted Average
        final_score = sum(
            scores.get(key, 0) * weight
            for key, weight in self.WEIGHTS.items()
        )
        
        return {
            'score': final_score,
            'level': 'low' if final_score < 3 else 'medium' if final_score < 7 else 'high',
            'factors': scores,
            'recommendations': self.get_recommendations(scores)
        }
```

### AI Chat Interface

```
User: "What should I do next?"

Agent Response Pipeline:
1. Parse user intent (question, command, search)
2. Retrieve assignment context
3. Query AI with relevant documents
4. Generate structured response
5. Format for UI display

Example Response:
{
  "response": "Based on the assignment status, here are the top 3 actions:
  
1. ✅ Request DSC from directors (URGENT)
   - Unblocks: MOA drafting, SPICe filing
   - Days saved: 5-7
   - Due by: May 15
   
2. Complete MOA drafting (IN PROGRESS)
   - Time estimate: 4 hours
   - Assigned: Priya
   
3. Follow up with client for Aadhaar (If needed)
   - Status: Submitted, awaiting verification",
   
  "quick_actions": [
    { "label": "Send DSC reminder", "action": "/api/send-reminder" },
    { "label": "View task details", "link": "/tasks/task-id" }
  ],
  
  "suggested_next": "Should I escalate DSC collection to partner?"
}
```

---

## Permission & Role System

### Role Definitions

```json
{
  "roles": [
    {
      "id": "admin",
      "name": "Administrator",
      "permissions": [
        "view_all_assignments",
        "edit_all_assignments",
        "delete_any_assignment",
        "manage_templates",
        "manage_users",
        "access_reports",
        "send_billing_notifications"
      ]
    },
    {
      "id": "partner",
      "name": "Senior Partner",
      "permissions": [
        "view_all_assignments",
        "edit_assigned_assignments",
        "approve_assignments",
        "manage_team",
        "create_templates",
        "access_reports",
        "view_billing"
      ]
    },
    {
      "id": "manager",
      "name": "Manager",
      "permissions": [
        "view_team_assignments",
        "edit_team_assignments",
        "assign_tasks",
        "approve_tasks",
        "view_reports"
      ]
    },
    {
      "id": "executive",
      "name": "Executive/Paralegal",
      "permissions": [
        "view_assigned_assignments",
        "update_task_status",
        "upload_documents",
        "comment_on_assignments",
        "view_own_tasks"
      ]
    },
    {
      "id": "client",
      "name": "Client (Portal Access)",
      "permissions": [
        "view_own_assignments",
        "view_own_documents_required",
        "upload_documents",
        "view_status_updates",
        "download_completed_documents"
      ]
    }
  ]
}
```

### Assignment-Level Permissions Matrix

|  | Admin | Partner | Manager | Executive | Client |
|--|-------|---------|---------|-----------|--------|
| View All | ✓ | ✓ | ✓ (team) | ✗ | ✗ |
| Create | ✓ | ✓ | ✓ | ✗ | ✗ |
| Edit | ✓ | ✓ | ✓ (team) | ✗ | ✗ |
| Delete | ✓ | ✓ | ✗ | ✗ | ✗ |
| Approve | ✓ | ✓ | ✓ | ✗ | ✗ |
| View Tasks | ✓ | ✓ | ✓ (team) | ✓ (own) | ✓ |
| Create Tasks | ✓ | ✓ | ✓ | ✗ | ✗ |
| Edit Tasks | ✓ | ✓ | ✓ (team) | ✓ (own) | ✗ |
| Upload Docs | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## Sample Templates & Data

### Sample 1: Incorporation Template

[See JSON in next section]

### Sample 2: MGT-7 Template

```json
{
  "id": "MGT7_FILING_V1",
  "name": "MGT-7 Annual Return Filing",
  "version": "1.0",
  "category": "Compliance",
  "estimated_duration_days": 30,
  "sla_days": 30,
  "regulatory_reference": "Companies Act 2013, Section 92",
  
  "tasks": [
    {
      "id": "T001",
      "name": "Collect Financial Statements",
      "description": "Gather audited financials and board approval",
      "standard_duration_days": 5,
      "order": 1
    },
    {
      "id": "T002",
      "name": "Verify Directors & KMP",
      "description": "Confirm all changes in directors/KMP",
      "standard_duration_days": 3,
      "order": 2,
      "depends_on": ["T001"]
    },
    {
      "id": "T003",
      "name": "Prepare MGT-7 Form",
      "standard_duration_days": 5,
      "order": 3,
      "depends_on": ["T002"]
    },
    {
      "id": "T004",
      "name": "Obtain Director Affidavits",
      "standard_duration_days": 5,
      "order": 4,
      "depends_on": ["T003"]
    }
  ],
  
  "documents_required": [
    { "id": "AUDITED_ACCOUNTS", "name": "Audited Financial Statements" },
    { "id": "BOARD_RESOLUTION", "name": "Board Resolution on Financials" },
    { "id": "DIRECTOR_AFFIDAVIT", "name": "Directors' Affidavits" }
  ],
  
  "approval_checkpoints": [
    {
      "stage": "partner_review",
      "description": "Partner reviews completed MGT-7",
      "reviewer": ["Partner"]
    }
  ]
}
```

### Sample 3: Assignment Instance

```json
{
  "id": "ASG_UUID_123",
  "assignment_number": "ASG-2026-001234",
  "client_id": "CLIENT_ACME",
  "template_id": "INCORPORATION_V2",
  
  "name": "Company Incorporation - Acme Tech Solutions",
  "description": "PVT LTD company incorporation with two foreign directors",
  "status": "in_progress",
  "priority": "high",
  
  "owner_id": "USER_PRIYA",
  "created_by": "USER_PRIYA",
  "created_at": "2026-05-12T10:00Z",
  "updated_at": "2026-05-14T15:30Z",
  
  "target_completion_date": "2026-06-26",
  "started_at": "2026-05-12T10:30Z",
  "actual_completion_date": null,
  
  "tasks": [
    {
      "id": "TASK_T001",
      "name": "Name Reservation",
      "status": "completed",
      "assignee_id": "USER_PRIYA",
      "due_date": "2026-05-15",
      "completed_at": "2026-05-14T17:00Z"
    },
    {
      "id": "TASK_T002",
      "name": "DSC Collection",
      "status": "waiting_for_client",
      "assignee_id": "USER_RAJESH",
      "due_date": "2026-05-20",
      "reminder_count": 1,
      "reminder_sent_at": "2026-05-13T09:00Z"
    }
  ],
  
  "documents_required": [
    {
      "id": "DOC_REQ_001",
      "name": "Director 1 PAN",
      "status": "collected",
      "collected_at": "2026-05-13T14:30Z",
      "document_id": "DOC_UUID_101"
    },
    {
      "id": "DOC_REQ_002",
      "name": "Director 1 Aadhaar",
      "status": "pending",
      "reminder_count": 2
    }
  ],
  
  "custom_metadata": {
    "foreign_directors_count": 2,
    "fema_required": true,
    "complexity_level": "high"
  },
  
  "risk_score": 7,
  "progress_percent": 45
}
```

---

## Tech Stack

### Recommended Stack

#### Frontend
```
Framework: Next.js 14+ (React 19)
Styling: Tailwind CSS
UI Components: Radix UI / Shadcn/ui
State Management: Zustand + TanStack Query
Charts: Recharts / D3.js
Timeline/Gantt: React-Big-Calendar or Visx
Real-time: Socket.io-client or Supabase Realtime
Search: Algolia
```

#### Backend
```
Runtime: Node.js (TypeScript) or Python
API: FastAPI (Python) or Express/Nest.js (Node)
Database: PostgreSQL 15+
ORM: Prisma or SQLAlchemy
Auth: NextAuth.js + JWT
Caching: Redis
Search: ElasticSearch or Meilisearch
Message Queue: Bull (Redis-based) or RabbitMQ
```

#### AI/ML
```
LLM Orchestration: LangGraph (Python)
LLM Provider: OpenAI GPT-4 / Gemini Pro
Document Processing: PyPDF2, Pillow, Pytesseract
Embeddings: OpenAI Embeddings / Ollama
Vector Store: Pinecone / Supabase pgvector
```

#### Infrastructure
```
Hosting: AWS or Vercel
Compute: ECS/EKS or Lambda
Storage: S3
CDN: CloudFront
Monitoring: Datadog / New Relic
Logging: CloudWatch / ELK Stack
```

---

## Implementation Roadmap

### Version 1: MVP (8-12 weeks)

**Goals:**
- Core assignment CRUD
- Basic task management
- Document upload
- Simple task status flow
- Manual team assignment
- Email notifications

**Deliverables:**
1. Assignment listing page (table view only)
2. Assignment create/edit modal
3. Task management (add/edit/status)
4. Document upload
5. Basic notification system
6. Role-based access control
7. Audit logs

**Tech:**
- Next.js (frontend)
- FastAPI/NestJS (backend)
- PostgreSQL
- Email queue with Nodemailer

### Version 2: AI-Enabled (12-16 weeks)

**Goals:**
- Document extraction (OCR)
- Timeline prediction
- Risk scoring
- Next action suggestions
- AI chat copilot
- Kanban view
- Dependency management

**Deliverables:**
1. Document processing pipeline
2. AI risk assessment
3. Timeline prediction model
4. Kanban board view
5. Task dependency visualization
6. AI copilot sidebar
7. Advanced search (Algolia)
8. Saved filters

**Tech:**
- LangGraph
- OpenAI/Gemini
- Pytesseract
- Algolia
- Socket.io for real-time updates

### Version 3: Enterprise Scale (16-24 weeks)

**Goals:**
- Multi-organization support
- Advanced permissions/approval workflows
- Billing/invoicing integration
- Client portal
- Advanced reporting
- Compliance automation
- Template automation

**Deliverables:**
1. White-label support
2. Advanced approval workflows
3. Billing system integration
4. Client self-service portal
5. Business Intelligence dashboard
6. Automated compliance alerts
7. Template versioning & management
8. Integration APIs for external tools

**Tech:**
- Kubernetes for scaling
- Stripe/Razorpay integration
- Elasticsearch for advanced search
- Data warehousingwith Snowflake/BigQuery

---

## Security & Scalability

### Security Measures

**Authentication:**
```
- JWT tokens with short expiration (15 min access, 7-day refresh)
- OAuth 2.0 for SSO
- MFA support (TOTP/SMS)
- Session timeout after 30 min inactivity
```

**Authorization:**
```
- Role-based access control (RBAC)
- Granular permissions at assignment/task level
- Audit logs for all data modifications
- Separation of duties (creator ≠ approver)
```

**Data Protection:**
```
- AES-256 encryption for sensitive documents in transit/at rest
- TLS 1.3 for all API communication
- CORS restrictions
- Rate limiting (1000 req/min per user)
- SQL injection prevention via parameterized queries
```

**Compliance:**
```
- GDPR compliance (right to access/delete)
- Data residency options
- Audit trail immutability
- Backup with encryption
```

### Scalability Architecture

**Horizontal Scaling:**
```
- Stateless API servers (load-balanced via AWS NLB)
- Read replicas for PostgreSQL
- Redis cluster for caching
- Elasticsearch cluster for search
```

**Database Optimization:**
```
- Indexing strategy on frequently queried columns
- Table partitioning by date for activity logs
- Connection pooling with PgBouncer
- Query optimization using EXPLAIN ANALYZE
```

**Caching Strategy:**
```
- Redis layer for user sessions, team data
- Browser caching for static assets (max-age: 1 year)
- API response caching (30 min for lists, 1 hour for templates)
```

**Asynchronous Processing:**
```
- Background jobs for heavy operations (document processing, email)
- Message queue (Bull/RabbitMQ) for reliable delivery
- Async task execution with retries
```

**Performance Targets:**
```
- API response time: <200ms (p95)
- Page load time: <2s (3G network simulation)
- Concurrent users: 1000+
- Transactions/second: 500+
```

---

## Future Vision

### AI-Autonomous Phase (Q4 2026+)

**Features:**
```
1. Fully Autonomous Workflows
   - AI creates assignments from client emails
   - Self-adjusting timelines based on patterns
   - Auto-escalation without human intervention
   - Predictive billable hours

2. Smart Document Management
   - Auto-categorization and tagging
   - Cross-document intelligence
   - Missing document prediction
   - Intelligent archival

3. Client Autonomy
   - Client self-service for routine compliance
   - AI understands client business complexity
   - Proactive compliance recommendations
   - Auto-generated client reports

4. Team Optimization
   - AI schedules team shifts for maximum throughput
   - Skill-based auto-assignment
   - Burnout detection and alerts
   - Career path recommendations based on skills

5. Regulatory Intelligence
   - Real-time regulatory changes tracking
   - Auto-update compliance requirements
   - Predictive compliance deadlines
   - Automatic regulatory filing generation

6. Cross-Domain Intelligence
   - Learn from industry patterns
   - Benchmark performance across law firms
   - Predict client churn
   - Recommend pricing strategies
```

### Potential Integrations

```
- Google Workspace (Drive, Docs, Gmail)
- Microsoft 365 (Teams, Outlook, OneDrive)
- Zapier/Make (automation platform)
- Slack (notifications, commands)
- WhatsApp Business (client communication)
- MCA Portal (direct filings)
- GST Portal (E-invoicing)
- Bank APIs (payment reconciliation)
- Stripe/Razorpay (billing)
```

---

## Quick Reference: Key Metrics

| Metric | Target | Importance |
|--------|--------|-----------|
| Assignment Completion SLA | >95% on-time | Critical |
| Document Collection Time | <7 days average | High |
| Team Capacity Utilization | 85-90% | High |
| Compliance Risk Score | < 5 as target | Critical |
| Timeline Prediction Accuracy | >85% | High |
| Client Satisfaction | > 4.5/5 | High |
| API Response Time (p95) | < 200ms | High |
| System Uptime | > 99.9% | Critical |

---

## Conclusion

This comprehensive design provides a complete blueprint for building a production-grade assignments module. The modular architecture supports rapid iteration while maintaining data integrity and security. The inclusion of AI integration positions the platform for intelligent, autonomous operations in the future.

Start with the MVP, validate with users, then layer in AI capabilities and enterprise features progressively.

