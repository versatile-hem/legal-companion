package com.suits.entities.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class LegalEntityRequest {

    @NotBlank(message = "Entity name is required")
    private String entityName;

    @NotNull(message = "Entity type is required")
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
    private String status;
    private String assignedManagerId;
    private List<String> tags;
    private String notes;

    // ── Getters / Setters ─────────────────────────────────
    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAssignedManagerId() { return assignedManagerId; }
    public void setAssignedManagerId(String assignedManagerId) { this.assignedManagerId = assignedManagerId; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
