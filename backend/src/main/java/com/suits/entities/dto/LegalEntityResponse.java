package com.suits.entities.dto;

import com.suits.entities.entity.EntityCompliance;
import com.suits.entities.entity.EntityDirector;
import com.suits.entities.entity.LegalEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class LegalEntityResponse {

    private UUID id;
    private String entityName;
    private String entityType;
    private LocalDate incorporationDate;
    private String cinLlpin;
    private String pan;
    private String tan;
    private String gstin;
    private String rocCode;
    private String financialYearEnd;
    private String registeredOffice;
    private String city;
    private String state;
    private String pincode;
    private String email;
    private String phone;
    private String website;
    private Long authorizedCapital;
    private Long paidUpCapital;
    private String complianceStatus;
    private LocalDate nextDueDate;
    private String status;
    private Integer aiRiskScore;
    private String aiSummary;
    private String assignedManagerName;
    private List<String> tags;
    private List<DirectorSummary> directors;
    private List<ComplianceSummary> compliances;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static LegalEntityResponse fromEntity(LegalEntity e) {
        LegalEntityResponse dto = new LegalEntityResponse();
        dto.id = e.getId();
        dto.entityName = e.getEntityName();
        dto.entityType = e.getEntityType() != null ? e.getEntityType().name() : null;
        dto.incorporationDate = e.getIncorporationDate();
        dto.cinLlpin = e.getCinLlpin();
        dto.pan = e.getPan();
        dto.tan = e.getTan();
        dto.gstin = e.getGstin();
        dto.rocCode = e.getRocCode();
        dto.financialYearEnd = e.getFinancialYearEnd();
        dto.registeredOffice = e.getRegisteredOffice();
        dto.city = e.getCity();
        dto.state = e.getState();
        dto.pincode = e.getPincode();
        dto.email = e.getEmail();
        dto.phone = e.getPhone();
        dto.website = e.getWebsite();
        dto.authorizedCapital = e.getAuthorizedCapital();
        dto.paidUpCapital = e.getPaidUpCapital();
        dto.complianceStatus = e.getComplianceStatus() != null ? e.getComplianceStatus().name() : "HEALTHY";
        dto.nextDueDate = e.getNextDueDate();
        dto.status = e.getStatus() != null ? e.getStatus().name() : "ACTIVE";
        dto.aiRiskScore = e.getAiRiskScore();
        dto.aiSummary = e.getAiSummary();
        dto.assignedManagerName = e.getAssignedManager() != null
            ? e.getAssignedManager().getFirstName() + " " + e.getAssignedManager().getLastName()
            : null;
        dto.tags = e.getTags() != null ? Arrays.asList(e.getTags()) : List.of();
        dto.directors = e.getDirectors() != null
            ? e.getDirectors().stream().map(DirectorSummary::from).collect(Collectors.toList())
            : List.of();
        dto.compliances = e.getCompliances() != null
            ? e.getCompliances().stream().map(ComplianceSummary::from).collect(Collectors.toList())
            : List.of();
        dto.createdAt = e.getCreatedAt();
        dto.updatedAt = e.getUpdatedAt();
        return dto;
    }

    // ── Nested DTOs ───────────────────────────────────────
    public static class DirectorSummary {
        public UUID id;
        public String directorName;
        public String din;
        public String designation;
        public String kycStatus;
        public LocalDate kycDueDate;
        public Boolean isActive;

        public static DirectorSummary from(EntityDirector d) {
            DirectorSummary s = new DirectorSummary();
            s.id = d.getId();
            s.directorName = d.getDirectorName();
            s.din = d.getDin();
            s.designation = d.getDesignation();
            s.kycStatus = d.getKycStatus();
            s.kycDueDate = d.getKycDueDate();
            s.isActive = d.getIsActive();
            return s;
        }
    }

    public static class ComplianceSummary {
        public UUID id;
        public String complianceName;
        public String formName;
        public String category;
        public String status;
        public String riskLevel;
        public LocalDate dueDate;
        public LocalDate completedDate;

        public static ComplianceSummary from(EntityCompliance c) {
            ComplianceSummary s = new ComplianceSummary();
            s.id = c.getId();
            s.complianceName = c.getComplianceName();
            s.formName = c.getFormName();
            s.category = c.getCategory() != null ? c.getCategory().name() : null;
            s.status = c.getStatus() != null ? c.getStatus().name() : "PENDING";
            s.riskLevel = c.getRiskLevel() != null ? c.getRiskLevel().name() : "MEDIUM";
            s.dueDate = c.getDueDate();
            s.completedDate = c.getCompletedDate();
            return s;
        }
    }

    // ── Getters ───────────────────────────────────────────
    public UUID getId() { return id; }
    public String getEntityName() { return entityName; }
    public String getEntityType() { return entityType; }
    public LocalDate getIncorporationDate() { return incorporationDate; }
    public String getCinLlpin() { return cinLlpin; }
    public String getPan() { return pan; }
    public String getTan() { return tan; }
    public String getGstin() { return gstin; }
    public String getRocCode() { return rocCode; }
    public String getFinancialYearEnd() { return financialYearEnd; }
    public String getRegisteredOffice() { return registeredOffice; }
    public String getCity() { return city; }
    public String getState() { return state; }
    public String getPincode() { return pincode; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getWebsite() { return website; }
    public Long getAuthorizedCapital() { return authorizedCapital; }
    public Long getPaidUpCapital() { return paidUpCapital; }
    public String getComplianceStatus() { return complianceStatus; }
    public LocalDate getNextDueDate() { return nextDueDate; }
    public String getStatus() { return status; }
    public Integer getAiRiskScore() { return aiRiskScore; }
    public String getAiSummary() { return aiSummary; }
    public String getAssignedManagerName() { return assignedManagerName; }
    public List<String> getTags() { return tags; }
    public List<DirectorSummary> getDirectors() { return directors; }
    public List<ComplianceSummary> getCompliances() { return compliances; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
