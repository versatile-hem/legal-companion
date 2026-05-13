-- V18: Add task financial fields and document/checklist support

-- Add financial columns to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS estimated_fee DECIMAL(10, 2);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS out_of_pocket_expense DECIMAL(10, 2);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS task_category VARCHAR(100);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS task_template VARCHAR(255);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_template ON tasks(task_template);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(task_category);

-- Ensure task_documents table has proper structure (from V3, verify)
ALTER TABLE task_documents ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE task_documents ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100);
ALTER TABLE task_documents ADD COLUMN IF NOT EXISTS uploaded_by UUID;

-- Add foreign key constraint for task_documents (drop if exists first)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_td_uploaded_by')
    THEN
        ALTER TABLE task_documents DROP CONSTRAINT fk_td_uploaded_by;
    END IF;
    ALTER TABLE task_documents ADD CONSTRAINT fk_td_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(id);
EXCEPTION WHEN OTHERS THEN
    NULL;
END$$;

-- Create indexes for task_documents
CREATE INDEX IF NOT EXISTS idx_td_task_id ON task_documents(task_id);
CREATE INDEX IF NOT EXISTS idx_td_uploaded_by ON task_documents(uploaded_by);

-- Ensure task_checklists table has proper structure (from V5, verify)
ALTER TABLE task_checklists ADD COLUMN IF NOT EXISTS item_order INTEGER DEFAULT 0;
ALTER TABLE task_checklists ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE task_checklists ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;
ALTER TABLE task_checklists ADD COLUMN IF NOT EXISTS completed_by UUID;

-- Add foreign key constraint for task_checklists (drop if exists first)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_tc_completed_by')
    THEN
        ALTER TABLE task_checklists DROP CONSTRAINT fk_tc_completed_by;
    END IF;
    ALTER TABLE task_checklists ADD CONSTRAINT fk_tc_completed_by FOREIGN KEY (completed_by) REFERENCES users(id);
EXCEPTION WHEN OTHERS THEN
    NULL;
END$$;

-- Create indexes for task_checklists
CREATE INDEX IF NOT EXISTS idx_tc_task_id ON task_checklists(task_id);
CREATE INDEX IF NOT EXISTS idx_tc_is_completed ON task_checklists(is_completed);

-- Add comment to tasks table explaining new financial fields
COMMENT ON COLUMN tasks.estimated_fee IS 'Template default fee, can be overridden per assignment';
COMMENT ON COLUMN tasks.out_of_pocket_expense IS 'Variable out-of-pocket expense for this specific task in the assignment';
COMMENT ON COLUMN tasks.task_category IS 'Category for grouping tasks (e.g., Incorporation, Compliance)';
COMMENT ON COLUMN tasks.task_template IS 'Reference to master task template name or type';
