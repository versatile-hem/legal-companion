package com.suits.assignments.service;

import com.suits.assignments.dto.TaskChecklistItemResponse;
import com.suits.assignments.entity.AssignmentTask;
import com.suits.assignments.entity.TaskChecklist;
import com.suits.assignments.repository.TaskChecklistRepository;
import com.suits.assignments.repository.TaskRepository;
import com.suits.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskChecklistService {

    private final TaskChecklistRepository checklistRepository;
    private final TaskRepository taskRepository;

    public TaskChecklistService(TaskChecklistRepository checklistRepository, TaskRepository taskRepository) {
        this.checklistRepository = checklistRepository;
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskChecklistItemResponse> getChecklistByTask(UUID taskId) {
        return checklistRepository.findByTaskIdOrderByOrderAsc(taskId).stream()
                .map(TaskChecklistItemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public TaskChecklistItemResponse createChecklistItem(UUID taskId, String name, Integer order) {
        AssignmentTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        TaskChecklist item = new TaskChecklist(task, name);
        if (order != null) {
            item.setOrder(order);
        }

        TaskChecklist saved = checklistRepository.save(item);
        return TaskChecklistItemResponse.fromEntity(saved);
    }

    public TaskChecklistItemResponse markComplete(UUID checklistItemId) {
        TaskChecklist item = checklistRepository.findById(checklistItemId)
                .orElseThrow(() -> new ResourceNotFoundException("TaskChecklist", "id", checklistItemId));

        item.setIsCompleted(true);
        item.setCompletedAt(LocalDateTime.now());

        TaskChecklist saved = checklistRepository.save(item);
        return TaskChecklistItemResponse.fromEntity(saved);
    }

    public TaskChecklistItemResponse markIncomplete(UUID checklistItemId) {
        TaskChecklist item = checklistRepository.findById(checklistItemId)
                .orElseThrow(() -> new ResourceNotFoundException("TaskChecklist", "id", checklistItemId));

        item.setIsCompleted(false);
        item.setCompletedAt(null);
        item.setCompletedBy(null);

        TaskChecklist saved = checklistRepository.save(item);
        return TaskChecklistItemResponse.fromEntity(saved);
    }

    public void deleteChecklistItem(UUID checklistItemId) {
        TaskChecklist item = checklistRepository.findById(checklistItemId)
                .orElseThrow(() -> new ResourceNotFoundException("TaskChecklist", "id", checklistItemId));
        checklistRepository.delete(item);
    }

    @Transactional(readOnly = true)
    public long getCompletedCount(UUID taskId) {
        return checklistRepository.countCompletedByTaskId(taskId);
    }

    @Transactional(readOnly = true)
    public long getTotalCount(UUID taskId) {
        return checklistRepository.countByTaskId(taskId);
    }
}
