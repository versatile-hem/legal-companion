-- Initial Database Schema for Suits In API
-- Flyway Migration: V1__initial_schema.sql

-- Roles Table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role Permissions
CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission VARCHAR(255) NOT NULL,
    PRIMARY KEY (role_id, permission)
);

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    last_login_at TIMESTAMP,
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- User Roles Junction Table
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Clients Table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    cin VARCHAR(21),
    pan VARCHAR(10),
    gst VARCHAR(15),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('COMPANY', 'LLP', 'PARTNERSHIP', 'PROPRIETORSHIP')),
    assigned_manager_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'PROSPECT')),
    tags JSONB,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Entities Table
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    incorporation_date DATE,
    authorized_capital DECIMAL(15, 2),
    paid_up_capital DECIMAL(15, 2),
    registered_office TEXT,
    industry VARCHAR(100),
    shareholding_pattern JSONB,
    business_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLOSED', 'DISSOLVED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Directors Table
CREATE TABLE directors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    din VARCHAR(8) UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    pan VARCHAR(10),
    aadhaar VARCHAR(12),
    kyc_status VARCHAR(50) DEFAULT 'PENDING' CHECK (kyc_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    kyc_verified_at TIMESTAMP,
    dsc_status VARCHAR(50) DEFAULT 'PENDING' CHECK (dsc_status IN ('PENDING', 'ACTIVE', 'EXPIRED')),
    date_of_birth DATE,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_directors_din ON directors(din);
CREATE INDEX idx_directors_pan ON directors(pan);
CREATE INDEX idx_directors_deleted_at ON directors(deleted_at);

-- Jobs Table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_number VARCHAR(50) NOT NULL UNIQUE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    job_type VARCHAR(50) NOT NULL CHECK (job_type IN ('MGT_7', 'AOC_4', 'DIR_3_KYC', 'SHARE_TRANSFER', 'INCORPORATION', 'RBI_FILING', 'TRADEMARK')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING_DOCS', 'IN_PROGRESS', 'REVIEW', 'FILED', 'COMPLETED', 'REJECTED')),
    priority VARCHAR(50) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    assigned_to_id UUID REFERENCES users(id),
    due_date DATE NOT NULL,
    completed_at TIMESTAMP,
    checklist JSONB,
    documents JSONB,
    attachments TEXT[],
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Invoices Table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    gst_amount DECIMAL(15, 2),
    total_amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_at TIMESTAMP,
    paid_amount DECIMAL(15, 2),
    status VARCHAR(50) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'VIEWED', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED')),
    payment_method VARCHAR(50),
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT', 'EXPORT')),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    read BOOLEAN DEFAULT FALSE,
    related_entity_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

-- Compliance Tasks Table
CREATE TABLE compliance_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    compliance_type VARCHAR(100),
    due_date DATE NOT NULL,
    priority VARCHAR(50) DEFAULT 'MEDIUM',
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE')),
    assigned_to_id UUID REFERENCES users(id),
    documents JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert Default Roles
INSERT INTO roles (name, description) VALUES 
    ('ADMIN', 'Administrator with full access'),
    ('PARTNER', 'Partner with firm-level access'),
    ('MANAGER', 'Manager with client management access'),
    ('EXECUTIVE', 'Executive with filing execution access'),
    ('VIEWER', 'Viewer with read-only access');

-- Insert Default Permissions for Admin
INSERT INTO role_permissions (role_id, permission) 
SELECT id, permission FROM (
    SELECT id, 
        UNNEST(ARRAY[
            'READ_CLIENTS', 'CREATE_CLIENTS', 'UPDATE_CLIENTS', 'DELETE_CLIENTS',
            'READ_JOBS', 'CREATE_JOBS', 'UPDATE_JOBS', 'DELETE_JOBS',
            'READ_INVOICES', 'CREATE_INVOICES', 'UPDATE_INVOICES', 'DELETE_INVOICES',
            'READ_USERS', 'CREATE_USERS', 'UPDATE_USERS', 'DELETE_USERS',
            'ACCESS_REPORTS', 'EXPORT_DATA', 'MANAGE_ROLES', 'VIEW_AUDIT_LOGS'
        ]) as permission
    FROM roles WHERE name = 'ADMIN'
) as admin_perms;

-- Create Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_clients_assigned_manager ON clients(assigned_manager_id);
CREATE INDEX idx_jobs_assigned_to ON jobs(assigned_to_id);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);
