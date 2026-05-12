package com.suits.entities.entity;

import com.suits.auth.entity.User;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "entity_compliance")
public class EntityCompliance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id", nullable = false)
    private LegalEntity entity;

    @Column(name = "compliance_name", nullable = false)
    private String complianceName;

    @Column(name = "form_name")
    private String formName;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private CategoryEnum category;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusEnum status = StatusEnum.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level")
    private RiskLevelEnum riskLevel = RiskLevelEnum.MEDIUM;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "completed_date")
    private LocalDate completedDate;

    @Column(name = "last_filing_date")
    private LocalDate lastFilingDate;

    @Column(name = "financial_year")
    private String financialYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @Column(name = "assignment_id")
    private UUID assignmentId;

    @Column(name = "penalty_amount")
    private Long penaltyAmount = 0L;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "pending_documents", columnDefinition = "text[]")
    private String[] pendingDocuments;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum CategoryEnum { ROC, GST, INCOME_TAX, LABOUR, FEMA_RBI, TRADEMARK, MSME, OTHER }
    public enum StatusEnum { PENDING, IN_PROGRESS, COMPLETED, OVERDUE, WAIVED, NA }
    public enum RiskLevelEnum { LOW, MEDIUM, HIGH, CRITICAL }

    // ── Getters / Setters ─────────────────────────────────
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public LegalEntity getEntity() { return entity; }
    public void setEntity(LegalEntity entity) { this.entity = entity; }

    public String getComplianceName() { return complianceName; }
    public void setComplianceName(String complianceName) { this.complianceName = complianceName; }

    public String getFormName() { return formName; }
    public void setFormName(String formName) { this.formName = formName; }

    public CategoryEnum getCategory() { return category; }
    public void setCategory(CategoryEnum category) { this.category = category; }

    public StatusEnum getStatus() { return status; }
    public void setStatus(StatusEnum status) { this.status = status; }

    public RiskLevelEnum getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevelEnum riskLevel) { this.riskLevel = riskLevel; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDate getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDate completedDate) { this.completedDate = completedDate; }

    public LocalDate getLastFilingDate() { return lastFilingDate; }
    public void setLastFilingDate(LocalDate lastFilingDate) { this.lastFilingDate = lastFilingDate; }

    public String getFinancialYear() { return financialYear; }
    public void setFinancialYear(String financialYear) { this.financialYear = financialYear; }

    public User getAssignedTo() { return assignedTo; }
    public void setAssignedTo(User assignedTo) { this.assignedTo = assignedTo; }

    public UUID getAssignmentId() { return assignmentId; }
    public void setAssignmentId(UUID assignmentId) { this.assignmentId = assignmentId; }

    public Long getPenaltyAmount() { return penaltyAmount; }
    public void setPenaltyAmount(Long penaltyAmount) { this.penaltyAmount = penaltyAmount; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String[] getPendingDocuments() { return pendingDocuments; }
    public void setPendingDocuments(String[] pendingDocuments) { this.pendingDocuments = pendingDocuments; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
