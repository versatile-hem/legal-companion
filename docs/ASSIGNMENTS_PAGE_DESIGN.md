# Assignments Page UI/UX Design Document

**Platform:** Suits In - AI-first Company Secretary Platform  
**Version:** 1.0  
**Date:** 12 May 2026  
**Status:** Design Phase - Ready for Implementation

---

## Table of Contents

1. [Overview](#overview)
2. [Page Architecture](#page-architecture)
3. [Top Navigation Bar](#top-navigation-bar)
4. [Assignment Listing Area](#assignment-listing-area)
5. [Create Assignment Modal](#create-assignment-modal)
6. [Task Management System](#task-management-system)
7. [Estimation System](#estimation-system)
8. [AI Assistance Engine](#ai-assistance-engine)
9. [State Management](#state-management)
10. [API Integration](#api-integration)
11. [Keyboard Shortcuts](#keyboard-shortcuts)
12. [Empty & Loading States](#empty--loading-states)
13. [Responsive Behavior](#responsive-behavior)
14. [Component Hierarchy](#component-hierarchy)

---

## Overview

### Purpose
The `/assignments` page is the operational hub for managing ROC filings, incorporation work, compliance tasks, and secretarial operations. It must be:
- **Fast**: Keyboard-driven with minimal mouse usage
- **AI-Native**: Suggestions, auto-completion, risk detection
- **Dense**: Packed with information and quick actions
- **Professional**: Enterprise SaaS quality (inspired by Linear, Notion, ClickUp)
- **India-Compliant**: Support MGT-7, Incorporation, Trademark workflows

### Key Metrics Target
- Page load: <800ms
- Modal open: <200ms
- Keyboard navigation: 5 actions/minute minimum
- AI suggestions response: <500ms

---

## Page Architecture

### High-Level Layout

```
┌──────────────────────────────────────────────────────────────────┐
│                     TOP NAVIGATION BAR (Sticky)                 │
│  Assignments | Search... | [Filters] | Status | Priority | Date  │
│                                        [+ Create] [User] [AI]     │
├──────────────────────────────────────────────────────────────────┤
│                     ASSIGNMENT LISTING AREA                      │
│                                                                  │
│ ┌─ Assignment 1 (Expandable) ───────────────────────────────┐  │
│ │ MGT-7 Filing - ABC Corp - Due: 15 May - Priority: HIGH   │  │
│ │ Status: In Progress (3/5 tasks done)                     │  │
│ │ [Expand] [Quick Edit] [AI Review] [Archive]             │  │
│ └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│ ┌─ Assignment 2 (Expandable) ───────────────────────────────┐  │
│ │ Incorporation - XYZ Ltd - Due: 30 May - Priority: MEDIUM │  │
│ │ Status: Pending (0/8 tasks done)                         │  │
│ │ [Expand] [Quick Edit] [AI Preview] [Archive]            │  │
│ └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│ [Load More...] or [Pagination]                                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Top Navigation Bar

### Design Specifications

**Position:** Sticky, top of viewport  
**Height:** 64px (compact) or 72px (with secondary row)  
**Background:** White/Light gray (dark-mode aware)  
**Border:** Bottom border, subtle shadow on scroll  

### Components (Left to Right)

#### Left Section
1. **Page Title "Assignments"**
   - Font: 20px, bold
   - Color: #1F2937 (dark mode aware)
   - Padding: 16px

2. **Search/AI Input**
   - Placeholder: "Search assignments... (Cmnd+K)"
   - Width: 300px (responsive: 200px on tablet, hidden on mobile)
   - Features:
     - Natural language search
     - Recent searches
     - AI-powered autocomplete
   - Example queries:
     - "MGT-7 pending"
     - "Assignments due this week"
     - "Trademark waiting for docs"
   - Keyboard: Cmd+K to focus globally

#### Center Section (Filter Bar)
3. **Status Filter**
   - Options: All, Pending, In Progress, Waiting, Under Review, Completed, Blocked
   - Type: Dropdown with multi-select
   - Icon: Filter chevron
   - Default: Shows applied count badge

4. **Assignment Type Filter**
   - Options: All, MGT-7, Incorporation, Trademark, Directors, Compliance, Other
   - Type: Quick toggle pills or dropdown
   - Default: All selected

5. **Priority Filter**
   - Options: All, Low, Medium, High, Critical
   - Type: Dropdown
   - Badges with color coding

6. **Due Date Range**
   - Type: Date range picker
   - Presets: Today, This week, This month, Overdue, All
   - Display: "Due: Jun 1-15" or shorthand

#### Right Section
7. **Notifications Icon**
   - Icon: Bell
   - Badge: Red dot if unread
   - Menu: Recent assignment updates, @ mentions, SLA alerts
   - Behavior: Click to open dropdown (click outside to close)

8. **AI Assistant Button**
   - Text: "AI" or "✨ AI Assistant"
   - Type: Primary outline button
   - Behavior: Opens AI chat panel (right sidebar or modal)
   - Shortcuts: Cmd+/ or just "/"

9. **Create Assignment Button**
   - Text: "+ Create Assignment"
   - Type: Primary, solid blue (#2563EB)
   - Size: Regular button
   - Keyboard: Cmd+Shift+N
   - Behavior: Opens Create Assignment Modal

10. **User Profile Dropdown**
    - Avatar: 32x32px
    - Initials or image
    - Dropdown menu:
      - Profile settings
      - Preferences
      - Logout

### Top Navigation Code Structure

```tsx
// AssignmentHeader.tsx
export interface AssignmentHeaderProps {
  onCreateClick: () => void;
  onSearchChange: (query: string) => void;
  filters: FilterState;
  onFilterChange: (filter: Partial<FilterState>) => void;
}

// Filter options
interface FilterState {
  status: string[];
  assignmentType: string[];
  priority: string[];
  dueDate: { from?: Date; to?: Date };
  assignee?: string;
}
```

---

## Assignment Listing Area

### Card Layout (Per Assignment)

**Card Height:** 100-140px (expandable)  
**Spacing:** 12px gap between cards  
**Hover State:** Subtle shadow lift, background shift

#### Default (Collapsed) Card View

```
┌─────────────────────────────────────────────────────┐
│ 📋 MGT-7 Filing - ABC Corp              [Due: 15 May]│
│ Status: In Progress ████░ (3/5 tasks)     [Priority]│
│ Owner: John Doe • Reviewer: Jane Smith               │
│                                                     │
│ [Expand] [Quick Edit] [AI Review] [Archive] [•••]   │
└─────────────────────────────────────────────────────┘
```

#### Expanded (With Tasks) View

```
┌─────────────────────────────────────────────────┐
│ 📋 MGT-7 Filing - ABC Corp      [•••] [Close] ✕ │
├─────────────────────────────────────────────────┤
│ Assignee: Team A | Due: 15 May | 3/5 tasks     │
├─────────────────────────────────────────────────┤
│ □ Task 1: DSC Collection - John - 2h - Done    │
│ □ Task 2: Document Review - Jane - 3h - In Prog│
│ □ Task 3: Filing Prep - AI - 1h - Pending      │
│ □ Task 4: [+ Add Task]                         │
├─────────────────────────────────────────────────┤
│ [Quick View] [Full Edit] [AI Suggestions]      │
└─────────────────────────────────────────────────┘
```

### Card Information Hierarchy

1. **Icon + Title + Client Name** (Primary)
   - Assignment type icon
   - Assignment name (bold)
   - Client company name (gray)

2. **Status Bar** (Secondary)
   - Progress bar
   - Task completion count ("3/5 tasks")
   - Color-coded status pill

3. **Metadata Row** (Tertiary)
   - Owner avatar + name
   - Due date (red if overdue, yellow if today, gray if future)
   - Priority badge
   - AI risk indicator (if high risk)

4. **Quick Actions** (Bottom)
   - Expand button
   - Quick edit
   - AI suggestions
   - Archive/Delete
   - More options (···)

### List Display Modes

**Tab 1: All Assignments**
- All active/recent assignments
- Sort options: Due date, Priority, Recent, Assigned to me

**Tab 2: My Assignments**
- Only assigned to current user
- Helpful for quick personal workflow

**Tab 3: Archived**
- Completed/archived assignments
- Retention: 90 days (configurable)

### Sorting Options

1. Due date (earliest first)
2. Priority (critical → low)
3. Recently created
4. Assigned to me first
5. Last modified
6. AI risk score (highest risk first)

---

## Create Assignment Modal

### Modal Architecture

**Size:** 90% viewport width (max 1200px)  
**Height:** 90% viewport height (max 800px)  
**Layout:** Two-column (left: form, right: AI panel)

```
┌─ CREATE ASSIGNMENT ──────────────────────────────┐
│                                                  │
│ ┌─ Left Column ─────┐  ┌─ Right Column ────────┐│
│ │ Form Fields       │  │ AI Suggestions Panel  ││
│ │ ┌─────────────────┤  │                       ││
│ │ │ Assignment Name │  │ • Suggested Tasks    ││
│ │ │ Client Select   │  │ • Timeline Estimate  ││
│ │ │ Assignment Type │  │ • Risk Indicators    ││
│ │ │ Priority        │  │ • Document Checklist ││
│ │ │ Due Date        │  │ • Required Approvals ││
│ │ │ Description     │  └───────────────────────┘│
│ │ │ Team Members    │                           │
│ │ │ Reviewer        │  ┌─ Estimation Summary ──┤
│ │ │ Custom Fields   │  │ Hours: 24h             │
│ │ └─────────────────┤  │ Days: 8 working days   │
│ │                   │  │ Cost: ₹12,000          │
│ │ ┌─ Tasks Section ─┤  │ Risk: ⚠️ High          │
│ │ │ Task Name   |...│  └────────────────────────┘│
│ │ │ Assignee    |...│                           │
│ │ │ Est. Hours  |...│                           │
│ │ │ + Add Task  |...│                           │
│ │ └─────────────────┤                           │
│ │                   │                           │
│ │ [Save Draft] [Create] [Create & Notify]      │
│ └───────────────────┘                           │
└──────────────────────────────────────────────────┘
```

### Left Column: Assignment Form

#### Section 1: Assignment Details

**Required Fields:**
1. **Assignment Name**
   - Type: Text input
   - Placeholder: "e.g., MGT-7 Filing - Q2 2026"
   - Validation: Max 100 chars, required
   - AI assist: Auto-suggest based on client history

2. **Client**
   - Type: Searchable dropdown/autocomplete
   - Options: Existing clients from database
   - Validation: Required
   - Features:
     - Search by company name, registration number
     - Show client logo/avatar
     - Recent clients pinned

3. **Assignment Type**
   - Type: Multi-select dropdown (but typically one)
   - Options: MGT-7, Incorporation, Trademark, Directors, Compliance, Annual, Tax, Other
   - Validation: Required
   - AI Integration: When changed, auto-populate suggested tasks

4. **Priority**
   - Type: Radio/Dropdown
   - Options: Low, Medium, High, Critical
   - Default: Medium
   - Visual: Color-coded (Red=Critical, Orange=High, Blue=Medium, Gray=Low)

5. **Due Date**
   - Type: Date picker
   - Validation: Future date (warning if <= 7 days)
   - Features:
     - Calendar picker
     - Quick presets: Tomorrow, Next week, Next month
     - Show working days remaining

6. **Description**
   - Type: Rich text editor (markdown support minimal)
   - Placeholder: "Add context, regulatory requirements, special notes..."
   - Features:
     - Link insertion
     - @ mention team members
     - AI markdown suggestions

#### Section 2: Assignment Metadata

7. **Assigned Team Members**
   - Type: Multi-select with avatars
   - Options: Current user + team members
   - Features:
     - Search by name/role
     - Role tags (Manager, Compliance, Filing, etc.)
     - Workload indicator

8. **Primary Reviewer**
   - Type: Single select dropdown
   - Requirements: Must be senior member
   - Features:
     - Show availability
     - Notification will be sent

9. **Compliance Category** (Auto-fill via Type)
   - Type: Read-only or dropdown
   - Examples:
     - MGT-7 → "Management Compliance"
     - Incorporation → "Entity Formation"
     - Trademark → "IP Protection"
   - Use: For filtering, reporting, SLA tracking

**Optional Fields:**
10. **Custom Metadata**
    - Type: Key-value pairs (add more)
    - Examples: "Client Reference Number", "Project Code", "Billing Code"

#### Section 3: Tasks

Display: Inline task table in modal (or expandable section)

**Task Row Structure:**
- Task name (text input, auto-focus on new)
- Assignee (dropdown)
- Due date (date picker)
- Priority (dropdown)
- Estimated hours (number input)
- Status (read-only: pending)
- Dependencies (dropdown to other tasks)
- Actions: Delete, Move up/down

**Row Templates (Quick Add):**
- Based on assignment type
- "Add task from template" option
- Example: For "Incorporation":
  - ✓ DSC Collection
  - ✓ Document Verification
  - ✓ Name Reservation
  - ✓ MOA Drafting
  - ✓ Share Capital Structure
  - ✓ SPICE+ Filing

### Right Column: AI Assistance Panel

#### AI Panel Section 1: Smart Suggestions

**Task Auto-Suggestions**
- Based on: Assignment type, client history, regulatory requirements
- Display: Checkboxes to add suggested tasks
- Example (for Incorporation):
  ```
  ✓ DSC Collection (2 days)
  ☐ Director KYC (1 day)
  ☐ Name Reservation (1 day)
  ☐ MOA Drafting (3 days)
  ☐ Incorporation Filing (2 days)
  ☐ Post-Incorporation Compliance (1 day)
  ```
- Refresh button: Regenerate based on new inputs

**Document Checklist**
- What documents are needed?
- Example:
  ```
  Required Documents:
  ☐ PAN of Directors
  ☐ Passport/Voter ID
  ☐ Address Proof
  ☐ Bank Statements (3 months)
  ☐ Rent Agreement
  ☐ DSC Digital Certificate
  ```

**Suggested Team Assignments**
- Based on expertise and workload
- Changes if primary type changes
- Show: Name, expertise, current workload

#### AI Panel Section 2: Timeline & Risk

**Estimated Timeline**
- Calculation:
  - Task duration sum + buffer (15%)
  - Working days calculation (excluding weekends)
  - Dependency chain analysis
- Display:
  ```
  Estimated Completion: 12 working days
  Expected: June 15, 2026
  Dependencies: 2 critical paths
  ```

**Risk Indicators**
- Traffic light system:
  - 🟢 Green: Low risk, all systems nominal
  - 🟡 Yellow: Medium risk, watch these factors
  - 🔴 Red: High risk, intervention needed

**Risk Factors:**
- Pending director information ("KYC pending, risk of 3-day delay")
- Missing documents ("Last 3 years financials not received")
- SLA tracking ("2 days remaining before SLA breach")
- External dependencies ("Awaiting client signature")
- Workload conflict ("Team member at 120% capacity")

**AI Warning Examples:**
```
⚠️ High Risk — Director KYC pending
   Action: Follow up with ABC Corp by Friday

⚠️ Medium Risk — Trademark search not initiated
   Action: Initiate within 2 days to meet timeline

✅ Green — All milestones on track
   Next critical date: Name reservation approval (3 days)
```

#### AI Panel Section 3: Estimation Summary

**Totals Display:**
```
Total Estimated Hours: 24 hours
Days to Complete: 8 working days
Internal Cost: ₹8,000
Client Billing: ₹12,000
Gross Margin: 33%
Expected Completion: June 15, 2026
Timeline Confidence: High (92%)
```

---

## Task Management System

### Task Structure

```typescript
interface Task {
  id: string;
  assignmentId: string;
  name: string;
  description?: string;
  assignee: User;
  status: 'PENDING' | 'IN_PROGRESS' | 'WAITING_FOR_CLIENT' | 'UNDER_REVIEW' | 'COMPLETED' | 'BLOCKED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedHours: number;
  actualHours?: number;
  dueDate: Date;
  startedAt?: Date;
  completedAt?: Date;
  dependencies: string[]; // task IDs
  checklist?: ChecklistItem[];
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Task Features

1. **Inline Editing**
   - Click field to edit
   - Auto-save on blur
   - Keyboard navigation (Tab to next field)

2. **Drag-and-Drop**
   - Reorder tasks
   - Change priority by dragging to different zone
   - Assign team member via drag

3. **Dependencies**
   - Task A → Task B (B can't start until A done)
   - Visual indication with connecting lines
   - AI warning if circular dependencies detected

4. **Checklists**
   - Sub-tasks within each task
   - Example (DSC Collection task):
     - ☐ Collect DSC from Director 1
     - ☐ Collect DSC from Director 2
     - ☐ Verify serial numbers
     - ☐ Store securely

5. **Time Tracking**
   - Estimated vs. actual hours
   - Auto-pause/resume
   - Time log history (who, when, how long)

---

## Estimation System

### Calculation Logic

**Task-Level Estimation:**
- Estimated hours (manual input from experience)
- Optional: Past similar task history reference
- Buffer: 15% automatic buffer for contingency

**Assignment-Level Totals:**
```
Total Estimated Hours = Sum(task.estimatedHours) + 15% buffer
Total Days = Ceiling(Estimated Hours / 8) + weekends/holidays
Cost = (Estimated Hours × Hourly Rate × Utilization %)
```

**Cost Tiers:**
- Internal hourly rate: ₹500-2000 depending on role
- Client billing rate: ₹1000-5000 depending on service
- Margin calculation: (Billing - Cost) / Billing

### Display Components

1. **Task Estimation Row**
   ```
   Task Name | Assignee | Est: 4h | Cost: ₹2000 | Due: Jun 5
   ```

2. **Assignment Estimation Footer**
   ```
   ┌─ ESTIMATION SUMMARY ──────────────────┐
   │ Total Time: 24 hours (17.5 working days)
   │ Internal Cost: ₹12,000                 │
   │ Client Billing: ₹18,000                │
   │ Expected Completion: June 15, 2026     │
   │ Confidence: High (92%)                 │
   └────────────────────────────────────────┘
   ```

3. **Risk Flag**
   - If estimated > 80 hours: 🔴 Very High Effort
   - If > SLA timeline: 🔴 Risk of SLA breach
   - If multiple blockers: 🟡 Multiple Dependencies

---

## AI Assistance Engine

### AI Features Matrix

| Feature | Trigger | Input | Output | UX |
|---------|---------|-------|--------|-----|
| Task Suggestion | Assignment Type selected | Type, Client history | Templated task list | Checkboxes to add |
| Timeline Estimation | Tasks created/modified | Tasks, dates, dependencies | Estimated completion date | Display card |
| Document Checklist | Type/Client selected | Assignment type, regulations | Required documents | Checklist |
| Team Recommendation | Team member field focused | Skills required, workload | Ranked list of people | Dropdown ranking |
| Risk Detection | Any field changed | All assignment data | Risk factors, warnings | Alert badge |
| Natural Search | Search box focuses | User types query | Matching assignments + AI tips | Autocomplete |
| Task Dependencies | Task creation | Task names, sequence logic | Suggested dependencies | Link suggestions |
| Effort Auto-fill | Task row added | Task type, assignment type | Estimated hours | Pre-filled field (editable) |

### AI Suggestion Implementation

**Task Auto-Suggestion:**
- When assignment type changes (e.g., "Incorporation")
- Query knowledge base for standard workflows
- Return: List of typical tasks with:
  - Task name
  - Estimated hours
  - Typical assignee role
  - Dependencies
- User clicks checkboxes to add (not forced)

**Timeline Prediction:**
- Parse task dependencies
- Calculate critical path
- Add 15% buffer for contingencies
- Account for team member availability
- Return: Expected completion date with confidence score

**Risk Scoring Algorithm:**
```
riskScore = (
  (missingDocuments.length × 0.3) +
  (pendingApprovals.length × 0.25) +
  (overdueTasks.length × 0.4) +
  (teamMemberUtilization > 100% ? 0.15 : 0) +
  (timelinePressure.daysRemaining < 5 ? 0.2 : 0)
)

riskLevel = 
  riskScore > 0.6 ? 'HIGH' :
  riskScore > 0.3 ? 'MEDIUM' :
  'LOW'
```

---

## State Management

### Zustand Store Architecture

```typescript
// assignmentStore.ts
interface AssignmentState {
  // List state
  assignments: Assignment[];
  filters: FilterState;
  sortBy: SortOption;
  isLoading: boolean;
  error?: string;

  // Modal state
  modalOpen: boolean;
  currentAssignment?: Assignment;
  draftAssignment: Partial<Assignment>;
  unsavedChanges: boolean;

  // AI state
  aiSuggestions: AISuggestion[];
  aiLoading: boolean;
  riskScore: number;
  estimatedTimeline: EstimationResult;

  // Pagination
  page: number;
  pageSize: number;
  total: number;

  // Actions
  fetchAssignments: () => Promise<void>;
  setFilter: (key: string, value: any) => void;
  setSortBy: (sort: SortOption) => void;
  openCreateModal: () => void;
  closeModal: () => void;
  updateDraft: (partial: Partial<Assignment>) => void;
  saveAssignment: (assignment: Assignment) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  fetchAISuggestions: (assignment: Partial<Assignment>) => Promise<void>;
  calculateRisk: (assignment: Partial<Assignment>) => void;
  calculateEstimation: (tasks: Task[]) => void;
}

// Usage in components:
const assignments = useAssignmentStore(s => s.assignments);
const openCreateModal = useAssignmentStore(s => s.openCreateModal);
```

### Draft Auto-Save

- Save draft every 5 seconds while form is being edited
- Debounce updates to avoid excessive API calls
- Show "Saving..." indicator
- Unsaved changes badge: Show alert on page leave if changes exist
- Recovery: Load last saved draft if modal reopens

---

## API Integration

### Backend Endpoints

**Authentication:** JWT Bearer token (from existing auth system)

#### 1. List Assignments
```
GET /api/v1/assignments
Query params:
  - page: number (default: 1)
  - limit: number (default: 20)
  - status: string[] (multi-select)
  - assignmentType: string[]
  - priority: string[]
  - dueFrom: ISO date
  - dueTo: ISO date
  - assignee: string (UUID)
  - search: string

Response: 200 OK
{
  data: Assignment[],
  total: number,
  page: number,
  pageSize: number
}
```

#### 2. Get Single Assignment
```
GET /api/v1/assignments/{id}

Response: 200 OK
{
  data: Assignment (with nested tasks)
}
```

#### 3. Create Assignment
```
POST /api/v1/assignments
Body: {
  name: string,
  clientId: UUID,
  assignmentType: string,
  priority: string,
  dueDate: ISO date,
  description?: string,
  assignedTeam: UUID[],
  reviewerId: UUID,
  tasks: CreateTaskRequest[]
}

Response: 201 Created
{
  data: Assignment
}
```

#### 4. Update Assignment
```
PATCH /api/v1/assignments/{id}
Body: Partial<Assignment>

Response: 200 OK
{
  data: Assignment
}
```

#### 5. Delete Assignment
```
DELETE /api/v1/assignments/{id}

Response: 204 No Content
```

#### 6. Create Task
```
POST /api/v1/assignments/{assignmentId}/tasks
Body: CreateTaskRequest

Response: 201 Created
{
  data: Task
}
```

#### 7. Update Task
```
PATCH /api/v1/assignments/{assignmentId}/tasks/{taskId}

Response: 200 OK
{
  data: Task
}
```

#### 8. Get AI Suggestions
```
POST /api/v1/ai/suggestions
Body: {
  assignmentType: string,
  clientId: UUID,
  context?: string
}

Response: 200 OK
{
  tasks: SuggestedTask[],
  timeline: EstimationResult,
  documents: DocumentItem[],
  risks: RiskFactor[],
  confidence: number
}
```

#### 9. Calculate Risk Score
```
POST /api/v1/assignments/risk-score
Body: {
  assignmentType: string,
  tasks: Task[],
  dueDate: ISO date,
  status: string
}

Response: 200 OK
{
  riskScore: number,
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH',
  factors: RiskFactor[]
}
```

#### 10. Quick Search (AI-powered)
```
GET /api/v1/assignments/search
Query: q=string (natural language)

Response: 200 OK
{
  results: Assignment[],
  suggestions: string[]
}
```

---

## Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Cmd+K` / `Ctrl+K` | Focus search | Anywhere on page |
| `Cmd+/` / `Ctrl+/` | Open AI assistant | Anywhere on page |
| `Cmd+Shift+N` / `Ctrl+Shift+N` | Open Create modal | Anywhere |
| `/` | Start writing task | In modal, task section |

### Modal Shortcuts (When Open)

| Shortcut | Action |
|----------|--------|
| `Tab` | Focus next field |
| `Shift+Tab` | Focus previous field |
| `Cmd+Enter` | Create assignment |
| `Cmd+S` | Save draft |
| `Esc` | Close modal (warn if unsaved) |
| `Cmd+A` | Show all AI suggestions |
| `↓` / `↑` | Navigate task rows |
| `D` | Duplicate task |
| `R` | Remove task (press R twice) |

### List Shortcuts

| Shortcut | Action |
|----------|--------|
| `E` | Expand assignment |
| `C` | Collapse assignment |
| `Enter` | Edit assignment |
| `/` | Search within results |
| `1` | Filter status = Pending |
| `2` | Filter status = In Progress |
| `3` | Filter status = Completed |

---

## Empty & Loading States

### Empty State (No Assignments)

```
┌─────────────────────────────────────────────┐
│                                             │
│           📭 No Assignments Yet             │
│                                             │
│      You haven't created any assignments    │
│      Start by clicking the button below.    │
│                                             │
│      [+ Create Your First Assignment]       │
│                                             │
│      Or browse templates:                   │
│      • MGT-7 Filing (Most common)          │
│      • Incorporation (New entity)           │
│      • Trademark (IP Protection)            │
│                                             │
└─────────────────────────────────────────────┘
```

### Empty State (No Results After Filter)

```
┌─────────────────────────────────────────────┐
│                                             │
│          🔍 No Matching Assignments         │
│                                             │
│      Try adjusting filters:                 │
│      • Clear status filter                  │
│      • Expand date range                    │
│      • Remove priority filter               │
│                                             │
│      Or create a new assignment             │
│      [+ Create Assignment]                  │
│                                             │
└─────────────────────────────────────────────┘
```

### Loading State (Skeleton)

```
┌─────────────────────────────────────────────┐
│ 📋 [████████░░░░░] - [████░░░░░░░░░]      │
│ Status: [████░░] ████░░░░░░ [████░░]     │
│                                             │
├─────────────────────────────────────────────┤
│ 📋 [████████████░░░░░░░░░] - [████░░░░]   │
│ Status: [████████░░] [████████░░] [████░░] │
│                                             │
├─────────────────────────────────────────────┤
│ 📋 [████░░░░░░░░░░░░░░░░░] - [██░░░░░░]   │
│ Status: [██░░░░] [████████░░░░] [███░░] │
└─────────────────────────────────────────────┘
```

### Modal Loading State

```
┌─ CREATE ASSIGNMENT ──────────────────────┐
│                                          │
│ ┌─ Left ────────┐ ┌─ Right ────────────┐│
│ │ Name: [      │ │ Loading AI Panel..  ││
│ │ Client: [    │ │                     ││
│ │ Type: [      │ │ ✨ Generating       ││
│ │ ...          │ │ suggestions...       ││
│ │              │ │                     ││
│ │              │ │ (0.5s - 2s typical) ││
│ │              │ │                     ││
│ │ [Loading...] │ │ [████░░░░░░░░░]     ││
│ └──────────────┘ └─────────────────────┘│
└──────────────────────────────────────────┘
```

### Error State (API Error)

```
┌──────────────────────────────────────────┐
│ ❌ Failed to Load Assignments            │
│                                          │
│ Error: Connection timeout (retry in 30s) │
│                                          │
│ [Retry Now] [Go Back]                    │
│                                          │
│ Error details:                           │
│ POST /api/v1/assignments                 │
│ Status: 504 Gateway Timeout              │
│ Timestamp: 2026-05-12T11:00:00Z          │
└──────────────────────────────────────────┘
```

---

## Responsive Behavior

### Desktop (1200px+)
- Full two-column modal layout
- All filter chips visible
- Full assignment cards with metadata
- Sidebar visible always

### Tablet (768px - 1199px)
- Modal: Single column, tabs for left/right panel
- Filters in collapsible drawer
- Compact assignment cards
- Sidebar collapses to icon bar

### Mobile (< 768px)
- Modal: Full-screen, single column
- Search bar takes 70% width
- Filters in drawer
- Assignment cards: Minimal info, expand to see details
- Quick actions in overflow menu
- Touch-friendly tap targets (48px minimum)

---

## Component Hierarchy

```
AssignmentsPage/
├── AssignmentHeader/
│   ├── PageTitle
│   ├── SearchBox
│   ├── FilterBar/
│   │   ├── StatusFilter
│   │   ├── TypeFilter
│   │   ├── PriorityFilter
│   │   └── DateRangeFilter
│   ├── NotificationsButton
│   ├── AIAssistantButton
│   ├── CreateAssignmentButton
│   └── UserProfile
├── AssignmentList/
│   ├── AssignmentCard[] (expandable)
│   │   ├── CardHeader
│   │   ├── ProgressBar
│   │   ├── MetadataRow
│   │   ├── QuickActionsBar
│   │   └── ExpandedTasksView (if expanded)
│   │       ├── TaskRow[]
│   │       └── AddTaskButton
│   └── Pagination
├── CreateAssignmentModal/
│   ├── ModalHeader
│   ├── TwoColumnLayout
│   │   ├── LeftColumn/
│   │   │   ├── AssignmentDetailsSection
│   │   │   │   ├── NameInput
│   │   │   │   ├── ClientSelect
│   │   │   │   ├── TypeSelect
│   │   │   │   ├── PrioritySelect
│   │   │   │   ├── DueDatePicker
│   │   │   │   ├── DescriptionEditor
│   │   │   │   ├── TeamMembersSelect
│   │   │   │   ├── ReviewerSelect
│   │   │   │   └── ComplianceCategoryDisplay
│   │   │   └── TasksSection/
│   │   │       ├── TaskRow[]
│   │   │       ├── TaskRowFields (Name, Assignee, Hours, Status, etc.)
│   │   │       ├── TaskAddButton
│   │   │       └── QuickTemplateButton
│   │   └── RightColumn/
│   │       ├── AISuggestionsPanel/
│   │       │   ├── TaskSuggestionsSection
│   │       │   ├── DocumentChecklistSection
│   │       │   ├── TeamRecommendationSection
│   │       │   └── RefreshButton
│   │       ├── TimelineEstimationCard
│   │       ├── RiskIndicatorCard
│   │       └── EstimationSummaryFooter
│   └── ModalFooter/
│       ├── SaveDraftButton
│       ├── CreateButton
│       ├── CreateAndNotifyButton
│       └── CancelButton
└── FloatingAIAssistant/ (optional sidebar)
```

---

## Database Schema Extensions

### Assignment Table (New Fields)
```sql
ALTER TABLE assignments ADD COLUMN (
  custom_metadata JSONB,
  estimated_hours DECIMAL(10,2),
  estimated_cost DECIMAL(15,2),
  client_billing_cost DECIMAL(15,2),
  risk_score DECIMAL(3,2),
  risk_level VARCHAR(20),
  complation_timeline_days INT,
  expected_completion_date DATE,
  ai_generated BOOLEAN,
  confidence_score DECIMAL(3,2)
);
```

### Tasks Table
```sql
CREATE TABLE assignment_tasks (
  id UUID PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES users(id),
  status VARCHAR(20),
  priority VARCHAR(20),
  estimated_hours DECIMAL(10,2),
  actual_hours DECIMAL(10,2),
  due_date DATE,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  dependencies JSONB, -- Array of task IDs
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
- ✅ Assignment list page basic layout
- ✅ Top navigation bar (static filters)
- ✅ Card display with basic info
- ✅ API integration for assignment listing

### Phase 2: Modal & Form (Week 2)
- ⏳ Create assignment modal layout
- ⏳ Form fields with validation
- ⏳ Task inline editing
- ⏳ Draft auto-save

### Phase 3: AI Features (Week 3)
- ⏳ AI suggestion engine
- ⏳ Risk calculation
- ⏳ Timeline estimation
- ⏳ Document checklist generation

### Phase 4: Polish & UX (Week 4)
- ⏳ Animations and transitions
- ⏳ Keyboard shortcuts
- ⏳ Error handling & recovery
- ⏳ Mobile responsiveness

### Phase 5: Advanced Features (Week 5+)
- ⏳ Drag-and-drop task reordering
- ⏳ Task dependencies visualization
- ⏳ Time tracking
- ⏳ Real-time collaboration

---

## Design System / Tailwind Config

### Color Palette

**Status Colors:**
- Pending: `#EAB308` (yellow-500)
- In Progress: `#3B82F6` (blue-500)
- Waiting: `#F97316` (orange-500)
- Under Review: `#A855F7` (purple-500)
- Completed: `#10B981` (emerald-500)
- Blocked: `#EF4444` (red-500)
- Cancelled: `#6B7280` (gray-500)

**Priority Colors:**
- Low: `#6B7280` (gray-500)
- Medium: `#3B82F6` (blue-500)
- High: `#F97316` (orange-500)
- Critical: `#DC2626` (red-600)

**Risk Colors:**
- Low/Green: `#10B981` (emerald-500)
- Medium/Yellow: `#EAB308` (yellow-500)
- High/Red: `#EF4444` (red-500)

### Typography

- **Page Title:** 24px, 700 weight, #1F2937
- **Section Header:** 18px, 700 weight, #1F2937
- **Card Title:** 16px, 600 weight, #1F2937
- **Body Text:** 14px, 400 weight, #4B5563
- **Label:** 12px, 600 weight, #6B7280
- **Code/Mono:** Courier New, 12px, #1F2937

### Spacing
- Gap between cards: 12px
- Modal padding: 24px
- Button padding: 10px 16px
- Input padding: 8px 12px

### Shadows

```css
/* Card hover */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

/* Modal */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

/* Dropdown */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

---

## Success Metrics

1. **Performance**
   - Page load: < 800ms
   - Modal open: < 200ms
   - AI suggestions: < 500ms
   - Keyboard navigation: 5+ actions/minute

2. **UX**
   - 90% of assignments creatable in < 2 minutes
   - 80% keyboard usage for power users
   - 0 validation errors for well-formed data
   - < 3% abandonment rate in modal

3. **Feature Adoption**
   - 75% of assignments use AI suggestions
   - 60% of users save drafts
   - 80% of assignments have estimated hours
   - 50% use quick templates

---

## Next Steps

1. Implement Phase 1: Basic list and header
2. Get stakeholder feedback on layout
3. Implement Phase 2: Modal form
4. Integrate AI suggestions (Phase 3)
5. Full QA and polish
6. Deploy to production

---

**Document Version:** 1.0  
**Last Updated:** 12 May 2026  
**Status:** Ready for Development
