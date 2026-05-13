package com.suits.assignments.repository;

import com.suits.assignments.entity.TaskChecklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskChecklistRepository extends JpaRepository<TaskChecklist, UUID> {
    List<TaskChecklist> findByTaskIdOrderByOrderAsc(UUID taskId);
    
    @Query("SELECT COUNT(tc) FROM TaskChecklist tc WHERE tc.task.id = :taskId AND tc.isCompleted = true")
    long countCompletedByTaskId(@Param("taskId") UUID taskId);
    
    @Query("SELECT COUNT(tc) FROM TaskChecklist tc WHERE tc.task.id = :taskId")
    long countByTaskId(@Param("taskId") UUID taskId);
}
