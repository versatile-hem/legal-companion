package com.suits.directors.entity;

import com.suits.entities.entity.LegalEntity;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "director_entity_map")
@IdClass(DirectorEntityMappingId.class)
public class DirectorEntityMapping {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "director_id", nullable = false)
    private Director director;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id", nullable = false)
    private LegalEntity entity;

    @Column(name = "appointment_date")
    private LocalDate appointmentDate;

    @Column(name = "cessation_date")
    private LocalDate cessationDate;

    public DirectorEntityMapping() {}

    public DirectorEntityMapping(Director director, LegalEntity entity) {
        this.director = director;
        this.entity = entity;
    }

    public DirectorEntityMapping(Director director, LegalEntity entity, LocalDate appointmentDate) {
        this.director = director;
        this.entity = entity;
        this.appointmentDate = appointmentDate;
    }

    // Getters & Setters
    public Director getDirector() { return director; }
    public void setDirector(Director director) { this.director = director; }

    public LegalEntity getEntity() { return entity; }
    public void setEntity(LegalEntity entity) { this.entity = entity; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public LocalDate getCessationDate() { return cessationDate; }
    public void setCessationDate(LocalDate cessationDate) { this.cessationDate = cessationDate; }
}
