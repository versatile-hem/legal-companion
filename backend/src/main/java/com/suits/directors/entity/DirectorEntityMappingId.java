package com.suits.directors.entity;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public class DirectorEntityMappingId implements Serializable {
    private UUID director;
    private UUID entity;

    public DirectorEntityMappingId() {}

    public DirectorEntityMappingId(UUID director, UUID entity) {
        this.director = director;
        this.entity = entity;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DirectorEntityMappingId that = (DirectorEntityMappingId) o;
        return Objects.equals(director, that.director) &&
               Objects.equals(entity, that.entity);
    }

    @Override
    public int hashCode() {
        return Objects.hash(director, entity);
    }

    // Getters & Setters
    public UUID getDirector() { return director; }
    public void setDirector(UUID director) { this.director = director; }

    public UUID getEntity() { return entity; }
    public void setEntity(UUID entity) { this.entity = entity; }
}
