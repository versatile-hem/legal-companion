package com.suits.directors.repository;

import com.suits.directors.entity.Director;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DirectorRepository extends JpaRepository<Director, UUID> {

    Optional<Director> findByDin(String din);

    @Query("SELECT d FROM Director d WHERE " +
           "(?1 IS NULL OR LOWER(d.fullName) LIKE LOWER(CONCAT('%', ?1, '%'))) " +
           "AND (?2 IS NULL OR d.kycStatus = ?2)")
    Page<Director> search(String name, Director.KycStatusEnum kycStatus, Pageable pageable);

    @Query("SELECT d FROM Director d WHERE d.isActive = true ORDER BY d.createdAt DESC")
    Page<Director> findAllActive(Pageable pageable);

    @Query("SELECT COUNT(d) FROM Director d WHERE d.kycStatus = :status")
    long countByKycStatus(@Param("status") Director.KycStatusEnum status);

    @Query(value = "SELECT d.* FROM directors d " +
                   "JOIN director_entity_map m ON m.director_id = d.id " +
                   "WHERE m.entity_id = :entityId",
           nativeQuery = true)
    java.util.List<Director> findByEntityId(@Param("entityId") UUID entityId);
}
