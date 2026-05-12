package com.suits.assignments.repository;

import com.suits.assignments.entity.AssignmentTask;
import com.suits.assignments.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<AssignmentTask, UUID> {
    
    List<AssignmentTask> findByAssignmentId(UUID assignmentId);
    
    Page<AssignmentTask> findByAssignmentId(UUID assignmentId, Pageable pageable);
    
    Page<AssignmentTask> findByAssignmentIdAndStatus(UUID assignmentId, TaskStatus status, Pageable pageable);
    
    List<AssignmentTask> findByStatus(TaskStatus status);
    
    Page<AssignmentTask> findByAssigneeId(UUID assigneeId, Pageable pageable);
    
    @Query("SELECT t FROM AssignmentTask t WHERE t.assignment.id = :assignmentId AND t.status = :status")
    List<AssignmentTask> findByAssignmentIdAndStatusList(@Param("assignmentId") UUID assignmentId, 
                                                          @Param("status") TaskStatus status);
}
