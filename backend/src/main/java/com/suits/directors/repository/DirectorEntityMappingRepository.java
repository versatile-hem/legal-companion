package com.suits.directors.repository;

import com.suits.directors.entity.DirectorEntityMapping;
import com.suits.directors.entity.DirectorEntityMappingId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DirectorEntityMappingRepository extends JpaRepository<DirectorEntityMapping, DirectorEntityMappingId> {
    
    /**
     * Find all entities for a given director
     */
    @Query("SELECT dem FROM DirectorEntityMapping dem WHERE dem.director.id = :directorId")
    List<DirectorEntityMapping> findByDirectorId(@Param("directorId") UUID directorId);
    
    /**
     * Find all directors for a given entity
     */
    @Query("SELECT dem FROM DirectorEntityMapping dem WHERE dem.entity.id = :entityId")
    List<DirectorEntityMapping> findByEntityId(@Param("entityId") UUID entityId);
    
    /**
     * Check if a director is mapped to an entity
     */
    @Query("SELECT COUNT(dem) > 0 FROM DirectorEntityMapping dem WHERE dem.director.id = :directorId AND dem.entity.id = :entityId")
    boolean existsByDirectorAndEntity(@Param("directorId") UUID directorId, @Param("entityId") UUID entityId);
    
    /**
     * Get the count of entities for a director that are still active (no cessation date)
     */
    @Query("SELECT COUNT(dem) FROM DirectorEntityMapping dem WHERE dem.director.id = :directorId AND dem.cessationDate IS NULL")
    long countActiveEntitiesForDirector(@Param("directorId") UUID directorId);
}
