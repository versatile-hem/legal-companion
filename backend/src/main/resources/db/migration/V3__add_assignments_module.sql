-- Database Migration: Add Assignments Module
-- Version: V3__add_assignments_module.sql
-- Created: May 12, 2026

-- Enums
CREATE TYPE assignment_status AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'WAITING_FOR_CLIENT',
    'UNDER_REVIEW',
    'COMPLETED',
    'BLOCKED',
    'CANCELLED'
);

CREATE TYPE task_status AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'WAITING_FOR_CLIENT',
    'UNDER_REVIEW',
    'COMPLETED',
    'BLOCKED'
);

CREATE TYPE priority_level AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);

CREATE TYPE document_collection_status AS ENUM (
    'PENDING',
    'SUBMITTED',
    'VERIFIED',
    'COLLECTED'
);

CREATE TYPE approval_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'NEEDS_REVISION'
);

CREATE TYPE dependency_type AS ENUM (
    'BLOCKS',
    'DEPENDS_ON',
    'RELATED'
);

CREATE TYPE action_type AS ENUM (
    'CREATED',
    'STARTED',
    'IN_PROGRESS',
    'COMPLETED',
    'APPROVED',
    'REJECTED',
    'TASK_ADDED',
    'TASK_REMOVED',
    'STATUS_CHANGED',
    'ASSIGNED',
    'REASSIGNED',
    'COMMENTED',
    'DOCUMENT_UPLOADED',
    'APPROVAL_REQUESTED',
    'ARCHIVED',
    'RESTORED',
    'DELETED'
);

CREATE TYPE insight_type AS ENUM (
    'RISK_ASSESSMENT',
    'NEXT_ACTION_SUGGESTION',
    'TIMELINE_PREDICTION',
    'COMPLIANCE_ALERT',
    'TEAM_WORKLOAD_ALERT',
    'DOCUMENT_STATUS_UPDATE',
    'SLA_WARNING',
    'EFFICIENCY_RECOMMENDATION'
);

-- Main Tables

CREATE TABLE assignment_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    version INT DEFAULT 1,
    is_published BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    estimated_hours DECIMAL(10,2),
    estimated_duration_days INTEGER,
    sla_days INTEGER,
    parent_template_id UUID REFERENCES assignment_templates(id),
    tasks_definition JSONB NOT NULL,
    documents_required JSONB,
    approval_workflow JSONB,
    conditional_rules JSONB,
    ai_prompts JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    regulatory_reference VARCHAR(500),
    complexity_level VARCHAR(20)
);

CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id),
    template_id UUID NOT NULL REFERENCES assignment_templates(id),
    assignment_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255),
    description TEXT,
    status assignment_status NOT NULL DEFAULT 'PENDING',
    priority priority_level NOT NULL DEFAULT 'MEDIUM',
    owner_id UUID NOT NULL REFERENCES users(id),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    target_completion_date DATE NOT NULL,
    sla_days INTEGER,
    actual_completion_date TIMESTAMP,
    custom_metadata JSONB,
    archived_at TIMESTAMP,
    is_archived BOOLEAN DEFAULT false
);

CREATE TABLE assignment_document_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_type_id VARCHAR(50),
    is_required BOOLEAN DEFAULT true,
    status document_collection_status DEFAULT 'PENDING',
    collected_by UUID REFERENCES users(id),
    collected_at TIMESTAMP,
    collected_from VARCHAR(100),
    first_reminder_sent BOOLEAN DEFAULT false,
    first_reminder_at TIMESTAMP,
    second_reminder_sent BOOLEAN DEFAULT false,
    second_reminder_at TIMESTAMP,
    escalation_level SMALLINT DEFAULT 0,
    document_id UUID,
    notes TEXT
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    template_task_id VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'PENDING',
    priority priority_level DEFAULT 'MEDIUM',
    order_in_assignment SMALLINT,
    assignee_id UUID REFERENCES users(id),
    reviewer_id UUID REFERENCES users(id),
    secondary_assignees UUID[],
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    due_date DATE NOT NULL,
    target_completion_date DATE,
    completed_at TIMESTAMP,
    estimated_hours DECIMAL(8,2),
    blocks_tasks UUID[],
    blocked_by_tasks UUID[],
    checklist_items JSONB,
    sla_hours INTEGER,
    sla_breach_at TIMESTAMP,
    custom_metadata JSONB
);

CREATE TABLE task_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_from_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    task_to_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    dependency_type dependency_type NOT NULL,
    condition_logic JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(task_from_id, task_to_id, dependency_type)
);

CREATE TABLE task_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT,
    file_type VARCHAR(50),
    document_category VARCHAR(100),
    document_type_id UUID,
    ocr_available BOOLEAN DEFAULT false,
    ocr_data JSONB,
    ocr_confidence DECIMAL(3,2),
    extraction_errors TEXT[],
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    approval_stage VARCHAR(100) NOT NULL,
    status approval_status NOT NULL DEFAULT 'PENDING',
    reviewer_id UUID NOT NULL REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    reviewed_by_user_id UUID REFERENCES users(id),
    feedback TEXT,
    revision_count SMALLINT DEFAULT 0,
    escalated_to UUID REFERENCES users(id),
    escalation_reason VARCHAR(255),
    escalated_at TIMESTAMP
);

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES users(id),
    action action_type NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    changes_before JSONB,
    changes_after JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    insight_type insight_type NOT NULL,
    insight_category VARCHAR(100),
    insight_data JSONB NOT NULL,
    confidence_score DECIMAL(3,2),
    generated_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    model_name VARCHAR(100),
    model_version VARCHAR(20)
);

-- Create indexes for better query performance
CREATE INDEX idx_assignment_templates_category ON assignment_templates(category, is_active);
CREATE INDEX idx_assignment_templates_created ON assignment_templates(created_at);
CREATE INDEX idx_assignments_client_status ON assignments(client_id, status);
CREATE INDEX idx_assignments_owner_date ON assignments(owner_id, target_completion_date);
CREATE INDEX idx_assignments_target_date ON assignments(target_completion_date);
CREATE INDEX idx_documents_assignment_status ON assignment_document_requirements(assignment_id, status);
CREATE INDEX idx_documents_collected ON assignment_document_requirements(collected_at);
CREATE INDEX idx_tasks_assignment_status ON tasks(assignment_id, status);
CREATE INDEX idx_tasks_assignee_due ON tasks(assignee_id, due_date);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_task_deps_from ON task_dependencies(task_from_id, dependency_type);
CREATE INDEX idx_task_docs_assignment ON task_documents(assignment_id, document_type_id);
CREATE INDEX idx_task_docs_uploaded ON task_documents(uploaded_at);
CREATE INDEX idx_approvals_assignment ON approvals(assignment_id, status);
CREATE INDEX idx_approvals_reviewer ON approvals(reviewer_id, status);
CREATE INDEX idx_approvals_assigned ON approvals(assigned_at);
CREATE INDEX idx_activity_logs_assignment ON activity_logs(assignment_id, created_at);
CREATE INDEX idx_activity_logs_actor ON activity_logs(actor_id, created_at);
CREATE INDEX idx_ai_insights_assignment ON ai_insights(assignment_id, insight_type, is_active);
CREATE INDEX idx_ai_insights_generated ON ai_insights(generated_at);
