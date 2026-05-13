package com.suits.directors.dto;

import com.suits.directors.entity.DirectorEntityMapping;
import com.suits.entities.dto.LegalEntitySummaryResponse;
import java.time.LocalDate;

public class DirectorEntityMappingResponse {
    private LegalEntitySummaryResponse entity;
    private LocalDate appointmentDate;
    private LocalDate cessationDate;
    private boolean isActive;

    public static DirectorEntityMappingResponse fromEntity(DirectorEntityMapping dem) {
        DirectorEntityMappingResponse r = new DirectorEntityMappingResponse();
        r.entity = LegalEntitySummaryResponse.fromEntity(dem.getEntity());
        r.appointmentDate = dem.getAppointmentDate();
        r.cessationDate = dem.getCessationDate();
        r.isActive = dem.getCessationDate() == null;
        return r;
    }

    // Getters & Setters
    public LegalEntitySummaryResponse getEntity() { return entity; }
    public void setEntity(LegalEntitySummaryResponse entity) { this.entity = entity; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public LocalDate getCessationDate() { return cessationDate; }
    public void setCessationDate(LocalDate cessationDate) { this.cessationDate = cessationDate; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
