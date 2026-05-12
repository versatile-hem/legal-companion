-- Flyway Migration V7: Full-Text Search & Additional Support Tables
-- Date: 2026-05-12
-- Purpose: Enable PostgreSQL full-text search and add helper tables

-- Enable full-text search extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create search index table
CREATE TABLE assignment_search_index (
    assignment_id UUID PRIMARY KEY REFERENCES assignments(id) ON DELETE CASCADE,
    search_text TSVECTOR,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to update search index when assignment changes
CREATE OR REPLACE FUNCTION update_assignment_search_index()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO assignment_search_index (assignment_id, search_text, updated_at)
    VALUES (
        NEW.id,
        to_tsvector('english', 
            COALESCE(NEW.name, '') || ' ' ||
            COALESCE(NEW.description, '') || ' ' ||
            COALESCE(NEW.assignment_type, '')
        ),
        CURRENT_TIMESTAMP
    )
    ON CONFLICT (assignment_id)
    DO UPDATE SET 
        search_text = EXCLUDED.search_text,
        updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assignment_search_index_trigger
AFTER INSERT OR UPDATE ON assignments
FOR EACH ROW EXECUTE FUNCTION update_assignment_search_index();

-- Index for full-text search
CREATE INDEX idx_assignment_search_text ON assignment_search_index USING GIN(search_text);

-- Billing estimates table
CREATE TABLE billing_estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    estimated_hours DECIMAL(10,2),
    hourly_rate DECIMAL(10,2),
    estimated_cost DECIMAL(15,2),
    client_billing_rate DECIMAL(10,2),
    client_billing_cost DECIMAL(15,2),
    margin DECIMAL(5,2),
    estimated_completion_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_billing_estimates_assignment_id ON billing_estimates(assignment_id);

-- Assignment templates mapping (which templates an assignment was created from)
CREATE TABLE assignment_template_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES assignment_templates(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assignment_template_mapping_assignment_id ON assignment_template_mapping(assignment_id);
CREATE INDEX idx_assignment_template_mapping_template_id ON assignment_template_mapping(template_id);

-- Workflow state history (audit trail for state changes)
CREATE TABLE workflow_state_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID NOT NULL,
    change_reason TEXT,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workflow_state_history_assignment_id ON workflow_state_history(assignment_id);
CREATE INDEX idx_workflow_state_history_changed_at ON workflow_state_history(changed_at);

-- Assignment tags (for categorization)
CREATE TABLE assignment_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assignment_tags_assignment_id ON assignment_tags(assignment_id);
CREATE INDEX idx_assignment_tags_tag_name ON assignment_tags(tag_name);

-- Workflow events (for event-driven architecture)
CREATE TABLE workflow_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_payload JSONB,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workflow_events_assignment_id ON workflow_events(assignment_id);
CREATE INDEX idx_workflow_events_processed ON workflow_events(processed);
