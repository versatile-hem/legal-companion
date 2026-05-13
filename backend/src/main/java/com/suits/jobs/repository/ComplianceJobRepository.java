package com.suits.jobs.repository;

import com.suits.jobs.entity.ComplianceJob;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ComplianceJobRepository extends JpaRepository<ComplianceJob, UUID> {

    Page<ComplianceJob> findByEntityId(UUID entityId, Pageable pageable);
    Page<ComplianceJob> findByClientId(UUID clientId, Pageable pageable);
    Page<ComplianceJob> findByStatus(ComplianceJob.JobStatus status, Pageable pageable);

    Page<ComplianceJob> findAll(Pageable pageable);

    @Query("SELECT j FROM ComplianceJob j WHERE " +
           "(:entityId IS NULL OR j.entity.id = :entityId) AND " +
           "(:clientId IS NULL OR j.client.id = :clientId) AND " +
           "(:status IS NULL OR CAST(j.status AS string) = :status) AND " +
           "(:jobType IS NULL OR CAST(j.jobType AS string) = :jobType)")
    Page<ComplianceJob> filter(
            @Param("entityId") UUID entityId,
            @Param("clientId") UUID clientId,
            @Param("status") String status,
            @Param("jobType") String jobType,
            Pageable pageable);

    @Query("SELECT COUNT(j) FROM ComplianceJob j WHERE j.status = :status")
    long countByStatus(@Param("status") ComplianceJob.JobStatus status);

    @Query("SELECT j FROM ComplianceJob j WHERE j.dueDate <= CURRENT_DATE AND " +
           "j.status NOT IN ('COMPLETED','FILED','REJECTED') ORDER BY j.dueDate ASC")
    List<ComplianceJob> findOverdue();

    @Query("SELECT j FROM ComplianceJob j ORDER BY j.createdAt DESC")
    List<ComplianceJob> findRecent(Pageable pageable);
}
