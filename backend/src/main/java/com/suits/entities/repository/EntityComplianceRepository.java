package com.suits.entities.repository;

import com.suits.entities.entity.EntityCompliance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EntityComplianceRepository extends JpaRepository<EntityCompliance, UUID> {
    List<EntityCompliance> findByEntityIdOrderByDueDateAsc(UUID entityId);
}
