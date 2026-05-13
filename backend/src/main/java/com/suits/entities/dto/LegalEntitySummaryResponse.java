package com.suits.entities.dto;

import com.suits.entities.entity.LegalEntity;
import java.util.UUID;

public class LegalEntitySummaryResponse {
    private UUID id;
    private String entityName;
    private String entityType;
    private String cin;
    private String pan;
    private String complianceStatus;
    private String status;

    public static LegalEntitySummaryResponse fromEntity(LegalEntity entity) {
        LegalEntitySummaryResponse r = new LegalEntitySummaryResponse();
        r.id = entity.getId();
        r.entityName = entity.getEntityName();
        r.entityType = entity.getEntityType() != null ? entity.getEntityType().name() : null;
        r.cin = entity.getCinLlpin();
        r.pan = entity.getPan();
        r.complianceStatus = entity.getComplianceStatus() != null ? entity.getComplianceStatus().name() : null;
        r.status = entity.getStatus() != null ? entity.getStatus().name() : null;
        return r;
    }

    // Getters & Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }

    public String getPan() { return pan; }
    public void setPan(String pan) { this.pan = pan; }

    public String getComplianceStatus() { return complianceStatus; }
    public void setComplianceStatus(String complianceStatus) { this.complianceStatus = complianceStatus; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
