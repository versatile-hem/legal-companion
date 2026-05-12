package com.suits.directors.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "directors")
public class Director {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(unique = true)
    private String din;

    private String pan;
    private String aadhaar;
    private String email;
    private String phone;

    @Column(name = "designation")
    private String designation = "Director";

    private String nationality = "Indian";

    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status")
    private KycStatusEnum kycStatus = KycStatusEnum.PENDING;

    @Column(name = "kyc_due_date")
    private LocalDate kycDueDate;

    @Column(name = "dsc_valid_until")
    private LocalDate dscValidUntil;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Director() {}

    // Getters & setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
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
    public KycStatusEnum getKycStatus() { return kycStatus; }
    public void setKycStatus(KycStatusEnum kycStatus) { this.kycStatus = kycStatus; }
    public LocalDate getKycDueDate() { return kycDueDate; }
    public void setKycDueDate(LocalDate kycDueDate) { this.kycDueDate = kycDueDate; }
    public LocalDate getDscValidUntil() { return dscValidUntil; }
    public void setDscValidUntil(LocalDate dscValidUntil) { this.dscValidUntil = dscValidUntil; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public enum KycStatusEnum { PENDING, COMPLETED, OVERDUE, EXPIRED }
}
