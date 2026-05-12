-- Fixed schema for PostgreSQL - Added missing indexes

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Clients table indexes
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_deleted_at ON clients(deleted_at);
CREATE INDEX IF NOT EXISTS idx_clients_cin ON clients(cin);
CREATE INDEX IF NOT EXISTS idx_clients_assigned_manager ON clients(assigned_manager_id);

-- Entities table indexes
CREATE INDEX IF NOT EXISTS idx_entities_client_id ON entities(client_id);
CREATE INDEX IF NOT EXISTS idx_entities_name ON entities(name);
CREATE INDEX IF NOT EXISTS idx_entities_deleted_at ON entities(deleted_at);

-- Directors table indexes
CREATE INDEX IF NOT EXISTS idx_directors_din ON directors(din);
CREATE INDEX IF NOT EXISTS idx_directors_deleted_at ON directors(deleted_at);

-- Jobs table indexes
CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_assigned_to_id ON jobs(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_jobs_deleted_at ON jobs(deleted_at);

-- Invoices table indexes
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_deleted_at ON invoices(deleted_at);

-- Audit logs table indexes (no deleted_at column)
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Notifications table indexes (no deleted_at column)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Compliance tasks table indexes
CREATE INDEX IF NOT EXISTS idx_compliance_tasks_client_id ON compliance_tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_compliance_tasks_assigned_to_id ON compliance_tasks(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_compliance_tasks_deleted_at ON compliance_tasks(deleted_at);
