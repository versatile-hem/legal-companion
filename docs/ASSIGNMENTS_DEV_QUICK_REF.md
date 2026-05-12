# Assignments Module - Developer Quick Reference

**Last Updated:** 12 May 2026  
**Phase:** 1 (Foundation) ✅ | 2 (Modal) ⏳ | 3 (AI) ⏳

---

## 🚀 Quick Navigation

### Documentation
- **Design Spec**: [ASSIGNMENTS_PAGE_DESIGN.md](./ASSIGNMENTS_PAGE_DESIGN.md) - 2000+ word comprehensive spec
- **Phase 1 Summary**: [ASSIGNMENTS_PHASE1_SUMMARY.md](./ASSIGNMENTS_PHASE1_SUMMARY.md) - Implementation status
- **This File**: Quick dev reference

### Code Files
- **Store**: `frontend/store/assignmentStore.ts` (250+ lines)
- **Components**: `frontend/components/assignments/` (Header, Card)
- **Page**: `frontend/app/(dashboard)/assignments/page.tsx` (170+ lines)
- **Types**: `frontend/types/assignment.ts`, `frontend/types/entities.ts`

---

## 📦 Component API Reference

### useAssignmentStore() - Zustand Store

```typescript
// Usage in components
const {
  // State
  assignments,          // Assignment[]
  filters,             // FilterState
  isLoading,           // boolean
  error,               // string | undefined
  modalOpen,           // boolean
  page,                // number
  total,               // number

  // Actions
  fetchAssignments,    // () => Promise<void>
  setFilter,           // (key, value) => void
  clearFilters,        // () => void
  setSortBy,           // (sort) => void
  openCreateModal,     // () => void
  closeModal,          // () => void
  saveAssignment,      // (assignment) => Promise<void>
  deleteAssignment,    // (id) => Promise<void>
  setPage,             // (page) => void
} = useAssignmentStore();
```

### AssignmentHeader Component

```typescript
interface AssignmentHeaderProps {
  onCreateClick: () => void;
  onSearchChange: (query: string) => void;
  onFilterChange: (filters: any) => void;
  filters: FilterState;
}

// Usage
<AssignmentHeader 
  onCreateClick={openCreateModal}
  onSearchChange={(q) => setFilter('search', q)}
  onFilterChange={(f) => handleFilterChange(f)}
  filters={filters}
/>
```

**Features:**
- Search box (Cmd+K focus)
- Filter dropdown with multi-select
- Create button (Cmd+Shift+N)
- Notifications bell
- User profile dropdown

### AssignmentCard Component

```typescript
interface AssignmentCardProps {
  assignment: Assignment;
  isExpanded?: boolean;
  onExpand?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// Usage
<AssignmentCard
  assignment={assignment}
  isExpanded={expandedId === assignment.id}
  onExpand={(id) => setExpandedId(id)}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

**Features:**
- Collapsible card
- Progress bar
- Status badge
- Task list (when expanded)
- Action menu

---

## 🎨 TypeScript Interfaces

### Main Types

```typescript
// Assignment
interface Assignment {
  id: string;
  assignmentNumber: string;
  name: string;
  client?: Client;
  clientId: string;
  assignmentType: AssignmentType;
  status: AssignmentStatus;
  priority: PriorityLevel;
  owner?: User;
  ownerId: string;
  targetCompletionDate: Date;
  estimatedHours?: number;
  tasks?: Task[];
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  // ... more fields
}

// Task
interface Task {
  id: string;
  assignmentId: string;
  name: string;
  assignee?: User;
  status: TaskStatus;
  priority: PriorityLevel;
  estimatedHours: number;
  dueDate: Date;
  dependencies?: string[];
  // ... more fields
}

// Filter State
interface FilterState {
  status: string[];
  assignmentType: string[];
  priority: string[];
  dueDate: { from?: Date; to?: Date };
  assignee?: string;
  search: string;
}
```

### Enums

```typescript
type AssignmentStatus = 
  | 'PENDING' 
  | 'IN_PROGRESS' 
  | 'WAITING_FOR_CLIENT' 
  | 'UNDER_REVIEW' 
  | 'COMPLETED' 
  | 'BLOCKED' 
  | 'CANCELLED';

type AssignmentType = 
  | 'MGT_7' 
  | 'INCORPORATION' 
  | 'TRADEMARK' 
  | 'DIRECTORS' 
  | 'COMPLIANCE' 
  | 'ANNUAL' 
  | 'TAX' 
  | 'OTHER';

type TaskStatus = 
  | 'PENDING' 
  | 'IN_PROGRESS' 
  | 'WAITING_FOR_CLIENT' 
  | 'UNDER_REVIEW' 
  | 'COMPLETED' 
  | 'BLOCKED';

type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
```

---

## 🔗 API Endpoints (Backend)

### List Assignments
```
GET /api/v1/assignments?page=1&limit=20&status=...&type=...
Response: { data: Assignment[], total: number, page: number, pageSize: number }
```

### Get Assignment
```
GET /api/v1/assignments/{id}
Response: { data: Assignment }
```

### Create Assignment
```
POST /api/v1/assignments
Body: { name, clientId, assignmentType, priority, dueDate, tasks[], ... }
Response: { data: Assignment }
```

### Update Assignment
```
PATCH /api/v1/assignments/{id}
Body: Partial<Assignment>
Response: { data: Assignment }
```

### Delete Assignment
```
DELETE /api/v1/assignments/{id}
Response: 204 No Content
```

### Get AI Suggestions
```
POST /api/v1/ai/suggestions
Body: { assignmentType, clientId, context }
Response: { tasks: [], timeline: {}, documents: [], riskScore, confidence }
```

---

## 🎯 Common Tasks

### Add a Filter Option

```typescript
// In AssignmentHeader.tsx, add to filterOptions array:
const newFilterOptions = [
  { id: 'NEW_VALUE', label: 'Display Label', color: 'bg-color text-color' }
];

// Then in handleFilterChange, add case for new filter
```

### Change Status Colors

```typescript
// In AssignmentCard.tsx, update getStatusColor():
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',  // ← Modify here
    // ... rest
  };
};
```

### Add Keyboard Shortcut

```typescript
// In assignments/page.tsx, in keydown listener:
if ((e.metaKey || e.ctrlKey) && e.key === 'your_key') {
  e.preventDefault();
  // Your action here
}
```

### Update Store Action

```typescript
// In assignmentStore.ts, add new action:
newAction: async (param) => {
  try {
    // Implement logic
    set({ /* update state */ });
  } catch (error) {
    set({ error: error.message });
  }
}
```

---

## 🧪 Testing API Integration

### Manual Testing

```bash
# Get token (from browser localStorage after login)
TOKEN="your-jwt-token"

# List assignments
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/assignments?page=1&limit=20

# Create assignment
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test", "clientId":"uuid", "assignmentType":"MGT_7", "targetCompletionDate":"2026-06-15"}' \
  http://localhost:8080/api/v1/assignments

# Delete assignment
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/assignments/{id}
```

### Testing in Browser Console

```javascript
// Test store
const store = useAssignmentStore.getState();
console.log(store.assignments);
store.fetchAssignments();

// Test filter
store.setFilter('status', ['PENDING', 'IN_PROGRESS']);

// Test create modal
store.openCreateModal();
```

---

## 🐛 Debugging

### Enable Debug Logging

```typescript
// In assignmentStore.ts
const store = create<AssignmentStore>((set, get) => ({
  // Add logging to key actions:
  fetchAssignments: async () => {
    console.log('[DEBUG] Filter state:', get().filters);
    // ... rest of function
  }
}));
```

### Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| API 403 error | Missing auth token | Check localStorage has token, verify JWT validity |
| Assignments not loading | Filter too restrictive | Try `clearFilters()` |
| Component not updating | Store not connected | Check `useAssignmentStore()` hook in component |
| Type errors | Old types cached | Run `npm run build` to clear TS cache |

---

## 📅 Phase Timeline

### Phase 1: Foundation ✅ (Done)
- ✅ Design specification
- ✅ State management
- ✅ List page & header
- ✅ Card component
- ✅ Basic filtering

**Time:** 4 hours  
**Files:** 8 new files, 5 modified

### Phase 2: Create Modal ⏳ (Next)
- [ ] Modal layout
- [ ] Form fields
- [ ] Inline task editing
- [ ] Draft auto-save
- [ ] Save/update API

**Est. time:** 3-4 days

### Phase 3: AI Features ⏳ (After Phase 2)
- [ ] Suggestion engine
- [ ] Timeline prediction
- [ ] Risk scoring
- [ ] Document checklist

**Est. time:** 2-3 days

### Phase 4: Polish ⏳ (After Phase 3)
- [ ] Animations
- [ ] Mobile responsive
- [ ] Error handling
- [ ] Accessibility

**Est. time:** 2 days

---

## 🚦 Build & Run

### Development

```bash
# Terminal 1: Frontend
cd frontend && npm run dev
# Runs on http://localhost:3000

# Terminal 2: Backend
cd backend && export JAVA_HOME=$(/usr/libexec/java_home -v 23)
java -jar target/suits-in-api-1.0.0.jar --server.port=8080
# Runs on http://localhost:8080
```

### Production Build

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && mvn clean package
```

---

## 📝 Code Standards

### React/TypeScript
- Use functional components with hooks
- Export interfaces from types/ folder
- Use const for components
- Add prop-types or TypeScript interfaces

### Zustand Store
- Keep state flat
- Use descriptive action names
- Add async error handling
- Update related state atomically

### Styling
- Tailwind CSS only (no CSS modules)
- Mobile-first responsive design
- Use `cn()` utility for class merging
- Dark mode compatible

### Comments
- Add comments for complex logic
- Document API integration points
- Mark TODOs with "// TODO: "

---

## 🔗 Links

- **Frontend Build**: [Next.js 14.2.35](https://nextjs.org/)
- **State Management**: [Zustand Docs](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS Docs](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend**: Java Spring Boot 3.x

---

## ✅ Checklist for Phase 2

When implementing Phase 2 (Modal), ensure:

- [ ] Create `CreateAssignmentModal.tsx` component
- [ ] Add form validation
- [ ] Add `updateDraft` UI binding
- [ ] Add save/create API calls
- [ ] Test integration with page
- [ ] Verify keyboard shortcuts
- [ ] Add error handling
- [ ] Test with mock data
- [ ] Commit to git with descriptive message

---

**Ready to start Phase 2?**  
Review the [Design Specification](./ASSIGNMENTS_PAGE_DESIGN.md) section "Create Assignment Modal Design" for detailed requirements.

Start with the form layout and component structure, then add functionality incrementally.
