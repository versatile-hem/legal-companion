package com.suits.assignments.service;

import com.suits.assignments.dto.CreateTaskRequest;
import com.suits.assignments.dto.TaskDTO;
import com.suits.assignments.dto.UpdateTaskRequest;
import com.suits.assignments.entity.*;
import com.suits.assignments.repository.TaskRepository;
import com.suits.assignments.repository.AssignmentRepository;
import com.suits.common.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {
    
    private final TaskRepository taskRepository;
    private final AssignmentRepository assignmentRepository;
    
    public TaskService(TaskRepository taskRepository, AssignmentRepository assignmentRepository) {
        this.taskRepository = taskRepository;
        this.assignmentRepository = assignmentRepository;
    }
    
    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByAssignment(UUID assignmentId) {
        List<AssignmentTask> tasks = taskRepository.findByAssignmentId(assignmentId);
        return tasks.stream().map(this::toDTO).collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public TaskDTO getTaskById(UUID id) {
        AssignmentTask task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return toDTO(task);
    }
    
    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status).stream()
            .map(this::toDTO).collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<TaskDTO> getTasksForUser(UUID userId, Pageable pageable) {
        return taskRepository.findByAssigneeId(userId, pageable).map(this::toDTO);
    }
    
    public TaskDTO createTask(UUID assignmentId, CreateTaskRequest request) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Assignment", "id", assignmentId));
        
        AssignmentTask task = new AssignmentTask();
        task.setAssignment(assignment);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(TaskStatus.PENDING);
        task.setPriority(PriorityLevel.MEDIUM);
        task.setDueDate(request.getDueDate());
        task.setCreatedAt(LocalDateTime.now());
        
        AssignmentTask saved = taskRepository.save(task);
        return toDTO(saved);
    }
    
    public TaskDTO updateTask(UUID id, UpdateTaskRequest request) {
        AssignmentTask task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        
        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        task.setUpdatedAt(LocalDateTime.now());
        
        AssignmentTask saved = taskRepository.save(task);
        return toDTO(saved);
    }
    
    public void deleteTask(UUID id) {
        taskRepository.deleteById(id);
    }
    
    public TaskDTO completeTask(UUID id) {
        AssignmentTask task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        
        task.setStatus(TaskStatus.COMPLETED);
        task.setCompletedAt(LocalDateTime.now());
        AssignmentTask saved = taskRepository.save(task);
        return toDTO(saved);
    }
    
    private TaskDTO toDTO(AssignmentTask task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus().toString());
        dto.setPriority(task.getPriority().toString());
        dto.setDueDate(task.getDueDate());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        return dto;
    }
}
