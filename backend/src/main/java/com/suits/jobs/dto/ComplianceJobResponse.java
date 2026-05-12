package com.suits.jobs.dto;

import com.suits.jobs.entity.ComplianceJob;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class ComplianceJobResponse {
    private UUID id;
    private String jobNumber;
    private String title;
    private String jobType;
    private String status;
    private String priority;
    private LocalDate dueDate;
    private LocalDateTime completionDate;
    private String financialYear;
    private UUID entityId;
    private String entityName;
    private UUID clientId;
    private String clientName;
    private String assignedTo;
    private BigDecimal billingAmount;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ComplianceJobResponse fromEntity(ComplianceJob j) {
        ComplianceJobResponse r = new ComplianceJobResponse();
        r.id = j.getId();
        r.jobNumber = j.getJobNumber();
        r.title = j.getTitle();
        r.jobType = j.getJobType() != null ? j.getJobType().name() : null;
        r.status = j.getStatus() != null ? j.getStatus().name() : null;
        r.priority = j.getPriority() != null ? j.getPriority().name() : null;
        r.dueDate = j.getDueDate();
        r.completionDate = j.getCompletionDate();
        r.financialYear = j.getFinancialYear();
        if (j.getEntity() != null) {
            r.entityId = j.getEntity().getId();
            r.entityName = j.getEntity().getEntityName();
        }
        if (j.getClient() != null) {
            r.clientId = j.getClient().getId();
            r.clientName = j.getClient().getName();
        }
        if (j.getAssignedTo() != null) {
            r.assignedTo = j.getAssignedTo().getFirstName() + " " + j.getAssignedTo().getLastName();
        }
        r.billingAmount = j.getBillingAmount();
        r.remarks = j.getRemarks();
        r.createdAt = j.getCreatedAt();
        r.updatedAt = j.getUpdatedAt();
        return r;
    }

    // Getters
    public UUID getId() { return id; }
    public String getJobNumber() { return jobNumber; }
    public String getTitle() { return title; }
    public String getJobType() { return jobType; }
    public String getStatus() { return status; }
    public String getPriority() { return priority; }
    public LocalDate getDueDate() { return dueDate; }
    public LocalDateTime getCompletionDate() { return completionDate; }
    public String getFinancialYear() { return financialYear; }
    public UUID getEntityId() { return entityId; }
    public String getEntityName() { return entityName; }
    public UUID getClientId() { return clientId; }
    public String getClientName() { return clientName; }
    public String getAssignedTo() { return assignedTo; }
    public BigDecimal getBillingAmount() { return billingAmount; }
    public String getRemarks() { return remarks; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
