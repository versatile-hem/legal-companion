package com.suits.directors.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public class DirectorRequest {
    @NotBlank
    private String fullName;
    private String din;
    private String pan;
    private String aadhaar;
    private String email;
    private String phone;
    private String designation;
    private String nationality;
    private String kycStatus;
    private LocalDate kycDueDate;
    private LocalDate dscValidUntil;
    private Boolean isActive;
    private String notes;

    // Getters & setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getDin() { return din; }
    public void setDin(String din) { this.din = din; }
    public String getPan() { return pan; }
    public void setPan(String pan) { this.pan = pan; }
    public String getAadhaar() { return aadhaar; }
    public void setAadhaar(String aadhaar) { this.aadhaar = aadhaar; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }
    public String getKycStatus() { return kycStatus; }
    public void setKycStatus(String kycStatus) { this.kycStatus = kycStatus; }
    public LocalDate getKycDueDate() { return kycDueDate; }
    public void setKycDueDate(LocalDate kycDueDate) { this.kycDueDate = kycDueDate; }
    public LocalDate getDscValidUntil() { return dscValidUntil; }
    public void setDscValidUntil(LocalDate dscValidUntil) { this.dscValidUntil = dscValidUntil; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
