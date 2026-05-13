-- ============================================================
-- V16: Directors (standalone), ComplianceJobs, Invoices
-- ============================================================

-- ── Drop old tables (will be recreated with new schema) ────
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS compliance_jobs CASCADE;
DROP TABLE IF EXISTS directors CASCADE;

-- ── Directors ──────────────────────────────────────────────
-- Drop old directors table (will be recreated with new schema)

CREATE TYPE kyc_status_enum AS ENUM ('PENDING','COMPLETED','OVERDUE','EXPIRED');

CREATE TABLE directors (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name        VARCHAR(255) NOT NULL,
    din              VARCHAR(20),
    pan              VARCHAR(15),
    aadhaar          VARCHAR(20),
    email            VARCHAR(255),
    phone            VARCHAR(20),
    designation      VARCHAR(100) DEFAULT 'Director',
    nationality      VARCHAR(50) DEFAULT 'Indian',
    kyc_status       kyc_status_enum DEFAULT 'PENDING',
    kyc_due_date     DATE,
    dsc_valid_until  DATE,
    is_active        BOOLEAN DEFAULT TRUE,
    notes            TEXT,
    created_at       TIMESTAMPTZ DEFAULT now(),
    updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_dirs_din        ON directors(din);
CREATE INDEX idx_dirs_pan        ON directors(pan);
CREATE INDEX idx_dirs_kyc_status ON directors(kyc_status);

-- entity ↔ director many-to-many
CREATE TABLE director_entity_map (
    director_id      UUID NOT NULL REFERENCES directors(id) ON DELETE CASCADE,
    entity_id        UUID NOT NULL REFERENCES legal_entity(id) ON DELETE CASCADE,
    appointment_date DATE,
    cessation_date   DATE,
    PRIMARY KEY (director_id, entity_id)
);

CREATE INDEX idx_dem_entity ON director_entity_map(entity_id);

-- ── Compliance Jobs ────────────────────────────────────────
CREATE TYPE job_type_enum AS ENUM (
    'ROC_FILING','GST_FILING','ITR_FILING','TDS_RETURN',
    'AUDIT','ANNUAL_RETURN','DIR_KYC','DPT3','AOC4','MGT7',
    'FORM11','LLPIN_FILING','OTHER'
);

CREATE TYPE job_status_enum AS ENUM (
    'DRAFT','PENDING_DOCS','IN_PROGRESS','REVIEW','FILED','COMPLETED','REJECTED'
);

CREATE TYPE priority_enum AS ENUM ('LOW','MEDIUM','HIGH','CRITICAL');

CREATE TABLE compliance_jobs (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_number       VARCHAR(30) UNIQUE,
    title            VARCHAR(255) NOT NULL,
    job_type         job_type_enum NOT NULL,
    status           job_status_enum DEFAULT 'DRAFT',
    priority         priority_enum DEFAULT 'MEDIUM',
    due_date         DATE,
    completion_date  TIMESTAMPTZ,
    financial_year   VARCHAR(10),
    entity_id        UUID REFERENCES legal_entity(id) ON DELETE SET NULL,
    client_id        UUID REFERENCES clients(id) ON DELETE SET NULL,
    assigned_to      UUID REFERENCES users(id),
    billing_amount   NUMERIC(12,2),
    remarks          TEXT,
    documents        TEXT[],
    created_at       TIMESTAMPTZ DEFAULT now(),
    updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_cj_entity_id ON compliance_jobs(entity_id);
CREATE INDEX idx_cj_client_id ON compliance_jobs(client_id);
CREATE INDEX idx_cj_status    ON compliance_jobs(status);
CREATE INDEX idx_cj_due_date  ON compliance_jobs(due_date);

-- ── Invoices ───────────────────────────────────────────────
CREATE TYPE invoice_status_enum AS ENUM ('DRAFT','SENT','PAID','OVERDUE','CANCELLED');

CREATE TABLE invoices (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number   VARCHAR(30) UNIQUE,
    client_id        UUID REFERENCES clients(id) ON DELETE SET NULL,
    job_id           UUID REFERENCES compliance_jobs(id) ON DELETE SET NULL,
    amount           NUMERIC(12,2) NOT NULL,
    gst_amount       NUMERIC(12,2) DEFAULT 0,
    total_amount     NUMERIC(12,2) NOT NULL,
    status           invoice_status_enum DEFAULT 'DRAFT',
    issue_date       DATE DEFAULT CURRENT_DATE,
    due_date         DATE,
    paid_date        DATE,
    payment_mode     VARCHAR(50),
    notes            TEXT,
    created_at       TIMESTAMPTZ DEFAULT now(),
    updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_inv_client_id ON invoices(client_id);
CREATE INDEX idx_inv_status    ON invoices(status);
CREATE INDEX idx_inv_due_date  ON invoices(due_date);
