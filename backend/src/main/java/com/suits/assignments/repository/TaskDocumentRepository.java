package com.suits.assignments.repository;

import com.suits.assignments.entity.TaskDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskDocumentRepository extends JpaRepository<TaskDocument, UUID> {
    List<TaskDocument> findByTaskIdOrderByCreatedAtDesc(UUID taskId);
    long countByTaskId(UUID taskId);
}
