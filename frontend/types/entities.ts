// Domain Types
export type UserRole = 'ADMIN' | 'PARTNER' | 'MANAGER' | 'EXECUTIVE' | 'VIEWER';

export type EntityType = 'COMPANY' | 'LLP' | 'PARTNERSHIP' | 'PROPRIETORSHIP';

export type JobType = 
  | 'MGT_7' 
  | 'AOC_4' 
  | 'DIR_3_KYC' 
  | 'SHARE_TRANSFER' 
  | 'INCORPORATION' 
  | 'RBI_FILING' 
  | 'TRADEMARK';

export type JobStatus = 
  | 'DRAFT'
  | 'PENDING_DOCS'
  | 'IN_PROGRESS'
  | 'REVIEW'
  | 'FILED'
  | 'COMPLETED'
  | 'REJECTED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'VIEWED' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PROSPECT';

export type KYCStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  profileImageUrl?: string;
  role: UserRole;
  status: UserStatus;
  roles?: Role[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
}

// Client Types
export interface Client {
  id: string;
  name: string;
  cin?: string;
  pan?: string;
  gst?: string;
  email?: string;
  phone?: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  entityType: EntityType;
  assignedManager?: User;
  assignedManagerId?: string;
  status: ClientStatus;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Entity Types
export interface Entity {
  id: string;
  clientId: string;
  name: string;
  incorporationDate?: Date;
  authorizedCapital?: number;
  paidUpCapital?: number;
  registeredOffice?: string;
  industry?: string;
  shareholdingPattern?: Record<string, any>;
  businessType?: string;
  status: 'ACTIVE' | 'CLOSED' | 'DISSOLVED';
  createdAt: Date;
  updatedAt: Date;
}

// Director Types
export interface Director {
  id: string;
  din?: string;
  fullName: string;
  email?: string;
  phone?: string;
  pan?: string;
  designation?: string;
  nationality?: string;
  kycStatus: string;
  kycDueDate?: string;
  dscValidUntil?: string;
  isActive?: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Job Types
export interface Job {
  id: string;
  jobNumber: string;
  clientId: string;
  jobType: JobType;
  title: string;
  description?: string;
  status: JobStatus;
  priority: Priority;
  assignedTo?: User;
  assignedToId?: string;
  dueDate: Date;
  completedAt?: Date;
  checklist?: Record<string, any>;
  documents?: Document[];
  attachments?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Invoice Types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  amount: number;
  gstAmount: number;
  totalAmount: number;
  description?: string;
  invoiceDate: Date;
  dueDate: Date;
  paidAt?: Date;
  paidAmount?: number;
  status: InvoiceStatus;
  paymentMethod?: string;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Document Types
export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type?: string;
  read: boolean;
  relatedEntityId?: string;
  createdAt: Date;
  readAt?: Date;
}

// Compliance Task Types
export interface ComplianceTask {
  id: string;
  clientId: string;
  title: string;
  description?: string;
  complianceType?: string;
  dueDate: Date;
  priority: Priority;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  assignedTo?: User;
  assignedToId?: string;
  documents?: Document[];
  createdAt: Date;
  updatedAt: Date;
}

// Assignment Types (New Assignments Module)
export type AssignmentStatus = 
  | 'PENDING' 
  | 'IN_PROGRESS' 
  | 'WAITING_FOR_CLIENT' 
  | 'UNDER_REVIEW' 
  | 'COMPLETED' 
  | 'BLOCKED' 
  | 'CANCELLED';

export type AssignmentType = 
  | 'MGT_7' 
  | 'INCORPORATION' 
  | 'TRADEMARK' 
  | 'DIRECTORS' 
  | 'COMPLIANCE' 
  | 'ANNUAL' 
  | 'TAX' 
  | 'OTHER';

export type TaskStatus = 
  | 'PENDING' 
  | 'IN_PROGRESS' 
  | 'WAITING_FOR_CLIENT' 
  | 'UNDER_REVIEW' 
  | 'COMPLETED' 
  | 'BLOCKED';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Financial/Document types for Task support
export interface TaskDocument {
  id: string;
  documentName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy?: string; // User email
  createdAt: Date;
}

export interface TaskChecklistItem {
  id: string;
  name: string;
  isCompleted: boolean;
  order: number;
  completedAt?: Date;
  completedBy?: string; // User email
}

export interface Task {
  id: string;
  assignmentId: string;
  title?: string;
  name: string;
  description?: string;
  assignee?: User;
  assigneeId?: string;
  status: TaskStatus;
  priority: PriorityLevel;
  estimatedHours?: number;
  actualHours?: number;
  dueDate: Date;
  startedAt?: Date;
  completedAt?: Date;
  dependencies?: string[]; // Array of task IDs
  checklist?: ChecklistItem[];
  attachments?: Document[];
  
  // New financial fields
  estimatedFee?: number;
  outOfPocketExpense?: number;
  taskCategory?: string;
  taskTemplate?: string;
  
  // New document/checklist support
  documents?: TaskDocument[];
  checklists?: TaskChecklistItem[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistItem {
  id: string;
  name: string;
  completed: boolean;
  completedAt?: Date;
}

export interface Assignment {
  id: string;
  assignmentNumber: string;
  client?: Client;
  clientId: string;
  name: string;
  description?: string;
  assignmentType: AssignmentType;
  status: AssignmentStatus;
  priority: PriorityLevel;
  owner?: User;
  ownerId: string;
  creator?: User;
  creatorId?: string;
  reviewer?: User;
  reviewerId?: string;
  assignedTeam?: User[];
  assignedTeamIds?: string[];
  startDate?: Date;
  targetCompletionDate: Date;
  completedDate?: Date;
  estimatedHours?: number;
  estimatedCost?: number;
  clientBillingCost?: number;
  riskScore?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  completionTimelines?: {
    days: number;
    completionDate: Date;
    confidence: number;
  };
  customMetadata?: Record<string, any>;
  tasks?: Task[];
  documents?: Document[];
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
