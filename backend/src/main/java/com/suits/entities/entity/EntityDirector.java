package com.suits.entities.entity;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "entity_director")
public class EntityDirector {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id", nullable = false)
    private LegalEntity entity;

    @Column(name = "director_name", nullable = false)
    private String directorName;

    private String din;
    private String designation;
    private String email;
    private String phone;
    private String pan;
    private String nationality = "Indian";

    @Column(name = "dsc_valid_until")
    private LocalDate dscValidUntil;

    @Column(name = "kyc_status")
    private String kycStatus = "PENDING";

    @Column(name = "kyc_due_date")
    private LocalDate kycDueDate;

    @Column(name = "appointment_date")
    private LocalDate appointmentDate;

    @Column(name = "cessation_date")
    private LocalDate cessationDate;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Getters / Setters ─────────────────────────────────
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public LegalEntity getEntity() { return entity; }
    public void setEntity(LegalEntity entity) { this.entity = entity; }

    public String getDirectorName() { return directorName; }
    public void setDirectorName(String directorName) { this.directorName = directorName; }

    public String getDin() { return din; }
    public void setDin(String din) { this.din = din; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPan() { return pan; }
    public void setPan(String pan) { this.pan = pan; }

    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }

    public LocalDate getDscValidUntil() { return dscValidUntil; }
    public void setDscValidUntil(LocalDate dscValidUntil) { this.dscValidUntil = dscValidUntil; }

    public String getKycStatus() { return kycStatus; }
    public void setKycStatus(String kycStatus) { this.kycStatus = kycStatus; }

    public LocalDate getKycDueDate() { return kycDueDate; }
    public void setKycDueDate(LocalDate kycDueDate) { this.kycDueDate = kycDueDate; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public LocalDate getCessationDate() { return cessationDate; }
    public void setCessationDate(LocalDate cessationDate) { this.cessationDate = cessationDate; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
