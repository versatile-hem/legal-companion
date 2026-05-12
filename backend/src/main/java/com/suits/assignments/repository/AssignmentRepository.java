package com.suits.assignments.repository;

import com.suits.assignments.entity.Assignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {

    Page<Assignment> findByClientId(UUID clientId, Pageable pageable);

    List<Assignment> findByOwnerId(UUID ownerId);

    @Query("SELECT a FROM Assignment a WHERE a.status = ?1 ORDER BY a.targetCompletionDate ASC")
    List<Assignment> findByStatusOrderByDueDateAsc(String status);
}
