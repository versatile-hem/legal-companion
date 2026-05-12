package com.suits.directors.dto;

import com.suits.directors.entity.Director;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class DirectorResponse {
    private UUID id;
    private String fullName;
    private String din;
    private String pan;
    private String email;
    private String phone;
    private String designation;
    private String nationality;
    private String kycStatus;
    private LocalDate kycDueDate;
    private LocalDate dscValidUntil;
    private boolean isActive;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static DirectorResponse fromEntity(Director d) {
        DirectorResponse r = new DirectorResponse();
        r.id = d.getId();
        r.fullName = d.getFullName();
        r.din = d.getDin();
        r.pan = d.getPan();
        r.email = d.getEmail();
        r.phone = d.getPhone();
        r.designation = d.getDesignation();
        r.nationality = d.getNationality();
        r.kycStatus = d.getKycStatus() != null ? d.getKycStatus().name() : null;
        r.kycDueDate = d.getKycDueDate();
        r.dscValidUntil = d.getDscValidUntil();
        r.isActive = d.isActive();
        r.notes = d.getNotes();
        r.createdAt = d.getCreatedAt();
        r.updatedAt = d.getUpdatedAt();
        return r;
    }

    // Getters
    public UUID getId() { return id; }
    public String getFullName() { return fullName; }
    public String getDin() { return din; }
    public String getPan() { return pan; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getDesignation() { return designation; }
    public String getNationality() { return nationality; }
    public String getKycStatus() { return kycStatus; }
    public LocalDate getKycDueDate() { return kycDueDate; }
    public LocalDate getDscValidUntil() { return dscValidUntil; }
    public boolean isActive() { return isActive; }
    public String getNotes() { return notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
