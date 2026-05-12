package com.suits.entities.repository;

import com.suits.entities.entity.LegalEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LegalEntityRepository extends JpaRepository<LegalEntity, UUID> {

    @Query("SELECT e FROM LegalEntity e WHERE e.deletedAt IS NULL")
    Page<LegalEntity> findAllActive(Pageable pageable);

    Optional<LegalEntity> findByIdAndDeletedAtIsNull(UUID id);

    @Query("""
        SELECT e FROM LegalEntity e
        WHERE e.deletedAt IS NULL
          AND (:search IS NULL OR :search = '' OR (
              LOWER(e.entityName) LIKE LOWER(CONCAT('%', :search, '%'))
              OR LOWER(COALESCE(e.cinLlpin, '')) LIKE LOWER(CONCAT('%', :search, '%'))
              OR LOWER(COALESCE(e.pan, '')) LIKE LOWER(CONCAT('%', :search, '%'))
              OR LOWER(COALESCE(e.email, '')) LIKE LOWER(CONCAT('%', :search, '%'))
          ))
          AND (:entityType IS NULL OR :entityType = '' OR CAST(e.entityType AS string) = :entityType)
          AND (:state IS NULL OR :state = '' OR LOWER(e.state) = LOWER(:state))
          AND (:status IS NULL OR :status = '' OR CAST(e.status AS string) = :status)
          AND (:complianceStatus IS NULL OR :complianceStatus = '' OR CAST(e.complianceStatus AS string) = :complianceStatus)
        """)
    Page<LegalEntity> searchAndFilter(
        @Param("search") String search,
        @Param("entityType") String entityType,
        @Param("state") String state,
        @Param("status") String status,
        @Param("complianceStatus") String complianceStatus,
        Pageable pageable
    );

    boolean existsByCinLlpinAndDeletedAtIsNull(String cinLlpin);
    boolean existsByPanAndDeletedAtIsNull(String pan);

    @Query("SELECT COUNT(e) FROM LegalEntity e WHERE e.deletedAt IS NULL AND e.status = 'ACTIVE'")
    long countActive();

    @Query("SELECT COUNT(e) FROM LegalEntity e WHERE e.deletedAt IS NULL AND e.complianceStatus IN ('OVERDUE', 'CRITICAL')")
    long countOverdue();
}
