-- Flyway Migration V4: Assignment Templates Supporting Tables
-- Date: 2026-05-12
-- Purpose: Create supporting tables for assignment templates
-- NOTE: assignment_templates table is created in V3

-- Template tasks (standard tasks for each template)
CREATE TABLE template_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES assignment_templates(id) ON DELETE CASCADE,
    task_name VARCHAR(255) NOT NULL,
    task_description TEXT,
    task_order INT NOT NULL,
    estimated_hours DECIMAL(10,2),
    required_role VARCHAR(100),
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_template_tasks_template_id ON template_tasks(template_id);
CREATE INDEX idx_template_tasks_order ON template_tasks(task_order);
