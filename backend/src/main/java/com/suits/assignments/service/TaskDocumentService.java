package com.suits.assignments.service;

import com.suits.assignments.dto.TaskDocumentResponse;
import com.suits.assignments.entity.AssignmentTask;
import com.suits.assignments.entity.TaskDocument;
import com.suits.assignments.repository.TaskDocumentRepository;
import com.suits.assignments.repository.TaskRepository;
import com.suits.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskDocumentService {

    private final TaskDocumentRepository documentRepository;
    private final TaskRepository taskRepository;

    public TaskDocumentService(TaskDocumentRepository documentRepository, TaskRepository taskRepository) {
        this.documentRepository = documentRepository;
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskDocumentResponse> getDocumentsByTask(UUID taskId) {
        return documentRepository.findByTaskIdOrderByCreatedAtDesc(taskId).stream()
                .map(TaskDocumentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public TaskDocumentResponse uploadDocument(UUID taskId, String documentName, String fileUrl, Long fileSize, String mimeType) {
        AssignmentTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        TaskDocument doc = new TaskDocument(task, documentName, fileUrl);
        doc.setFileSize(fileSize);
        doc.setMimeType(mimeType);

        TaskDocument saved = documentRepository.save(doc);
        return TaskDocumentResponse.fromEntity(saved);
    }

    public void deleteDocument(UUID documentId) {
        TaskDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("TaskDocument", "id", documentId));
        documentRepository.delete(doc);
    }

    @Transactional(readOnly = true)
    public long getDocumentCount(UUID taskId) {
        return documentRepository.countByTaskId(taskId);
    }
}
