package com.suits.entities.entity;

import com.suits.auth.entity.User;
import com.suits.clients.entity.Client;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "legal_entity", indexes = {
    @Index(name = "idx_le_entity_type",  columnList = "entity_type"),
    @Index(name = "idx_le_state",        columnList = "state"),
    @Index(name = "idx_le_status",       columnList = "status"),
    @Index(name = "idx_le_compliance",   columnList = "compliance_status"),
    @Index(name = "idx_le_next_due",     columnList = "next_due_date")
})
public class LegalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "entity_name", nullable = false)
    private String entityName;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false)
    private EntityTypeEnum entityType;

    @Column(name = "incorporation_date")
    private LocalDate incorporationDate;

    @Column(name = "cin_llpin", unique = true)
    private String cinLlpin;

    @Column(unique = true)
    private String pan;

    private String tan;
    private String gstin;

    @Column(name = "roc_code")
    private String rocCode;

    @Column(name = "financial_year_end")
    private String financialYearEnd = "March";

    @Column(name = "registered_office", columnDefinition = "TEXT")
    private String registeredOffice;

    private String city;
    private String state;
    private String pincode;
    private String email;
    private String phone;
    private String website;

    @Column(name = "authorized_capital")
    private Long authorizedCapital;

    @Column(name = "paid_up_capital")
    private Long paidUpCapital;

    @Enumerated(EnumType.STRING)
    @Column(name = "compliance_status")
    private ComplianceStatusEnum complianceStatus = ComplianceStatusEnum.HEALTHY;

    @Column(name = "next_due_date")
    private LocalDate nextDueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private EntityStatusEnum status = EntityStatusEnum.ACTIVE;

    @Column(name = "ai_risk_score")
    private Integer aiRiskScore = 0;

    @Column(name = "ai_summary", columnDefinition = "TEXT")
    private String aiSummary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_manager_id")
    private User assignedManager;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_owner_id")
    private Client clientOwner;

    @Column(name = "tags", columnDefinition = "text[]")
    private String[] tags;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "entity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EntityDirector> directors = new ArrayList<>();

    @OneToMany(mappedBy = "entity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EntityCompliance> compliances = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // ── Enums ──────────────────────────────────────────────
    public enum EntityTypeEnum {
        PRIVATE_LIMITED, PUBLIC_LIMITED, LLP, OPC,
        PARTNERSHIP, PROPRIETORSHIP, SECTION_8, TRUST, SOCIETY, HUF
    }

    public enum ComplianceStatusEnum {
        HEALTHY, AT_RISK, OVERDUE, CRITICAL, NOT_APPLICABLE
    }

    public enum EntityStatusEnum {
        ACTIVE, INACTIVE, STRUCK_OFF, UNDER_LIQUIDATION, DORMANT
    }

    // ── Getters / Setters ─────────────────────────────────
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }

    public EntityTypeEnum getEntityType() { return entityType; }
    public void setEntityType(EntityTypeEnum entityType) { this.entityType = entityType; }

    public LocalDate getIncorporationDate() { return incorporationDate; }
    public void setIncorporationDate(LocalDate incorporationDate) { this.incorporationDate = incorporationDate; }

    public String getCinLlpin() { return cinLlpin; }
    public void setCinLlpin(String cinLlpin) { this.cinLlpin = cinLlpin; }

    public String getPan() { return pan; }
    public void setPan(String pan) { this.pan = pan; }

    public String getTan() { return tan; }
    public void setTan(String tan) { this.tan = tan; }

    public String getGstin() { return gstin; }
    public void setGstin(String gstin) { this.gstin = gstin; }

    public String getRocCode() { return rocCode; }
    public void setRocCode(String rocCode) { this.rocCode = rocCode; }

    public String getFinancialYearEnd() { return financialYearEnd; }
    public void setFinancialYearEnd(String financialYearEnd) { this.financialYearEnd = financialYearEnd; }

    public String getRegisteredOffice() { return registeredOffice; }
    public void setRegisteredOffice(String registeredOffice) { this.registeredOffice = registeredOffice; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public Long getAuthorizedCapital() { return authorizedCapital; }
    public void setAuthorizedCapital(Long authorizedCapital) { this.authorizedCapital = authorizedCapital; }

    public Long getPaidUpCapital() { return paidUpCapital; }
    public void setPaidUpCapital(Long paidUpCapital) { this.paidUpCapital = paidUpCapital; }

    public ComplianceStatusEnum getComplianceStatus() { return complianceStatus; }
    public void setComplianceStatus(ComplianceStatusEnum complianceStatus) { this.complianceStatus = complianceStatus; }

    public LocalDate getNextDueDate() { return nextDueDate; }
    public void setNextDueDate(LocalDate nextDueDate) { this.nextDueDate = nextDueDate; }

    public EntityStatusEnum getStatus() { return status; }
    public void setStatus(EntityStatusEnum status) { this.status = status; }

    public Integer getAiRiskScore() { return aiRiskScore; }
    public void setAiRiskScore(Integer aiRiskScore) { this.aiRiskScore = aiRiskScore; }

    public String getAiSummary() { return aiSummary; }
    public void setAiSummary(String aiSummary) { this.aiSummary = aiSummary; }

    public User getAssignedManager() { return assignedManager; }
    public void setAssignedManager(User assignedManager) { this.assignedManager = assignedManager; }

    public Client getClientOwner() { return clientOwner; }
    public void setClientOwner(Client clientOwner) { this.clientOwner = clientOwner; }

    public String[] getTags() { return tags; }
    public void setTags(String[] tags) { this.tags = tags; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<EntityDirector> getDirectors() { return directors; }
    public void setDirectors(List<EntityDirector> directors) { this.directors = directors; }

    public List<EntityCompliance> getCompliances() { return compliances; }
    public void setCompliances(List<EntityCompliance> compliances) { this.compliances = compliances; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
