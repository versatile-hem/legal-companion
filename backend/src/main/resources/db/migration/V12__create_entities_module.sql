-- ============================================================
-- V12: Entities Module — Legal Entities for CS ERP
-- ============================================================

CREATE TYPE entity_type_enum AS ENUM (
    'PRIVATE_LIMITED',
    'PUBLIC_LIMITED',
    'LLP',
    'OPC',
    'PARTNERSHIP',
    'PROPRIETORSHIP',
    'SECTION_8',
    'TRUST',
    'SOCIETY',
    'HUF'
);

CREATE TYPE compliance_status_enum AS ENUM (
    'HEALTHY',
    'AT_RISK',
    'OVERDUE',
    'CRITICAL',
    'NOT_APPLICABLE'
);

CREATE TYPE entity_status_enum AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'STRUCK_OFF',
    'UNDER_LIQUIDATION',
    'DORMANT'
);

-- ============================================================
-- Main Table: legal_entity
-- ============================================================
CREATE TABLE legal_entity (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_name             VARCHAR(255) NOT NULL,
    entity_type             entity_type_enum NOT NULL,
    incorporation_date      DATE,
    cin_llpin               VARCHAR(50),
    pan                     VARCHAR(15),
    tan                     VARCHAR(15),
    gstin                   VARCHAR(20),
    roc_code                VARCHAR(20),
    financial_year_end      VARCHAR(10) DEFAULT 'March',
    registered_office       TEXT,
    city                    VARCHAR(100),
    state                   VARCHAR(100),
    pincode                 VARCHAR(10),
    email                   VARCHAR(255),
    phone                   VARCHAR(20),
    website                 VARCHAR(255),
    authorized_capital      BIGINT,
    paid_up_capital         BIGINT,
    compliance_status       compliance_status_enum DEFAULT 'HEALTHY',
    next_due_date           DATE,
    status                  entity_status_enum DEFAULT 'ACTIVE',
    ai_risk_score           INTEGER DEFAULT 0,
    ai_summary              TEXT,
    assigned_manager_id     UUID REFERENCES users(id),
    client_owner_id         UUID REFERENCES clients(id),
    tags                    TEXT[],
    notes                   TEXT,
    created_at              TIMESTAMPTZ DEFAULT now(),
    updated_at              TIMESTAMPTZ DEFAULT now(),
    deleted_at              TIMESTAMPTZ,

    CONSTRAINT cin_llpin_unique UNIQUE (cin_llpin),
    CONSTRAINT pan_unique UNIQUE (pan)
);

-- Indexes for fast search/filter
CREATE INDEX idx_le_entity_type   ON legal_entity(entity_type);
CREATE INDEX idx_le_state         ON legal_entity(state);
CREATE INDEX idx_le_status        ON legal_entity(status);
CREATE INDEX idx_le_compliance    ON legal_entity(compliance_status);
CREATE INDEX idx_le_next_due      ON legal_entity(next_due_date);
CREATE INDEX idx_le_deleted_at    ON legal_entity(deleted_at);
CREATE INDEX idx_le_name_search   ON legal_entity USING gin(to_tsvector('english', entity_name));

-- ============================================================
-- Child Table: entity_director
-- ============================================================
CREATE TABLE entity_director (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id       UUID NOT NULL REFERENCES legal_entity(id) ON DELETE CASCADE,
    director_name   VARCHAR(255) NOT NULL,
    din             VARCHAR(20),
    designation     VARCHAR(100),
    email           VARCHAR(255),
    phone           VARCHAR(20),
    pan             VARCHAR(15),
    nationality     VARCHAR(50) DEFAULT 'Indian',
    dsc_valid_until DATE,
    kyc_status      VARCHAR(30) DEFAULT 'PENDING',
    kyc_due_date    DATE,
    appointment_date DATE,
    cessation_date  DATE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ed_entity_id ON entity_director(entity_id);
CREATE INDEX idx_ed_din       ON entity_director(din);

-- ============================================================
-- Child Table: entity_compliance
-- ============================================================
CREATE TYPE compliance_category_enum AS ENUM (
    'ROC', 'GST', 'INCOME_TAX', 'LABOUR', 'FEMA_RBI',
    'TRADEMARK', 'MSME', 'OTHER'
);

CREATE TYPE compliance_item_status_enum AS ENUM (
    'PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'WAIVED', 'NA'
);

CREATE TYPE risk_level_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

CREATE TABLE entity_compliance (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id           UUID NOT NULL REFERENCES legal_entity(id) ON DELETE CASCADE,
    compliance_name     VARCHAR(255) NOT NULL,
    form_name           VARCHAR(100),
    category            compliance_category_enum NOT NULL,
    status              compliance_item_status_enum DEFAULT 'PENDING',
    risk_level          risk_level_enum DEFAULT 'MEDIUM',
    due_date            DATE,
    completed_date      DATE,
    last_filing_date    DATE,
    financial_year      VARCHAR(10),
    assigned_to         UUID REFERENCES users(id),
    assignment_id       UUID,
    penalty_amount      BIGINT DEFAULT 0,
    notes               TEXT,
    pending_documents   TEXT[],
    created_at          TIMESTAMPTZ DEFAULT now(),
    updated_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ec_entity_id ON entity_compliance(entity_id);
CREATE INDEX idx_ec_due_date  ON entity_compliance(due_date);
CREATE INDEX idx_ec_status    ON entity_compliance(status);

-- ============================================================
-- Child Table: entity_document
-- ============================================================
CREATE TABLE entity_document (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id       UUID NOT NULL REFERENCES legal_entity(id) ON DELETE CASCADE,
    document_name   VARCHAR(255) NOT NULL,
    document_type   VARCHAR(100),
    file_url        VARCHAR(1000),
    file_size       BIGINT,
    mime_type       VARCHAR(100),
    uploaded_by     UUID REFERENCES users(id),
    description     TEXT,
    tags            TEXT[],
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_edoc_entity_id ON entity_document(entity_id);

-- ============================================================
-- Child Table: entity_activity_log
-- ============================================================
CREATE TABLE entity_activity_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id       UUID NOT NULL REFERENCES legal_entity(id) ON DELETE CASCADE,
    action          VARCHAR(200) NOT NULL,
    description     TEXT,
    performed_by    UUID REFERENCES users(id),
    metadata        JSONB,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_eal_entity_id  ON entity_activity_log(entity_id);
CREATE INDEX idx_eal_created_at ON entity_activity_log(created_at);
