-- Flyway Migration V6: SLA Tracking System  
-- Date: 2026-05-12
-- Purpose: SLA tracking and monitoring
-- NOTE: activity_logs, notifications, and ai_insights are created in V3

-- SLA tracking
CREATE TABLE sla_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    sla_days INT NOT NULL,
    sla_end_date DATE NOT NULL,
    sla_status VARCHAR(50) DEFAULT 'ON_TRACK', -- ON_TRACK, WARNING, BREACH
    breach_notification_sent BOOLEAN DEFAULT false,
    warning_notification_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sla_tracking_assignment_id ON sla_tracking(assignment_id);
CREATE INDEX idx_sla_tracking_sla_status ON sla_tracking(sla_status);
CREATE INDEX idx_sla_tracking_sla_end_date ON sla_tracking(sla_end_date);

-- AI insights (already created in V3, this placeholder file can be empty or just contain SLA tracking)

