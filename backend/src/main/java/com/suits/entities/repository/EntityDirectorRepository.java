package com.suits.entities.repository;

import com.suits.entities.entity.EntityDirector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EntityDirectorRepository extends JpaRepository<EntityDirector, UUID> {
    List<EntityDirector> findByEntityIdAndIsActiveTrue(UUID entityId);
}
