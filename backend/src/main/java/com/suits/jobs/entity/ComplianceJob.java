package com.suits.jobs.entity;

import com.suits.auth.entity.User;
import com.suits.clients.entity.Client;
import com.suits.entities.entity.LegalEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "compliance_jobs")
public class ComplianceJob {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "job_number", unique = true)
    private String jobNumber;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", nullable = false)
    private JobType jobType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status = JobStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "completion_date")
    private LocalDateTime completionDate;

    @Column(name = "financial_year")
    private String financialYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id")
    private LegalEntity entity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @Column(name = "billing_amount", precision = 12, scale = 2)
    private BigDecimal billingAmount;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(columnDefinition = "TEXT[]")
    private String[] documents;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public ComplianceJob() {}

    // Getters & setters
    public UUID getId() { return id; }
    public String getJobNumber() { return jobNumber; }
    public void setJobNumber(String jobNumber) { this.jobNumber = jobNumber; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public JobType getJobType() { return jobType; }
    public void setJobType(JobType jobType) { this.jobType = jobType; }
    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public LocalDateTime getCompletionDate() { return completionDate; }
    public void setCompletionDate(LocalDateTime completionDate) { this.completionDate = completionDate; }
    public String getFinancialYear() { return financialYear; }
    public void setFinancialYear(String financialYear) { this.financialYear = financialYear; }
    public LegalEntity getEntity() { return entity; }
    public void setEntity(LegalEntity entity) { this.entity = entity; }
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    public User getAssignedTo() { return assignedTo; }
    public void setAssignedTo(User assignedTo) { this.assignedTo = assignedTo; }
    public BigDecimal getBillingAmount() { return billingAmount; }
    public void setBillingAmount(BigDecimal billingAmount) { this.billingAmount = billingAmount; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String[] getDocuments() { return documents; }
    public void setDocuments(String[] documents) { this.documents = documents; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public enum JobType {
        ROC_FILING, GST_FILING, ITR_FILING, TDS_RETURN, AUDIT,
        ANNUAL_RETURN, DIR_KYC, DPT3, AOC4, MGT7,
        FORM11, LLPIN_FILING, OTHER
    }

    public enum JobStatus {
        DRAFT, PENDING_DOCS, IN_PROGRESS, REVIEW, FILED, COMPLETED, REJECTED
    }

    public enum Priority { LOW, MEDIUM, HIGH, CRITICAL }
}
