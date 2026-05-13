package com.suits.assignments.dto;

import com.suits.assignments.entity.TaskDocument;
import java.time.LocalDateTime;
import java.util.UUID;

public class TaskDocumentResponse {
    private UUID id;
    private String documentName;
    private String fileUrl;
    private Long fileSize;
    private String mimeType;
    private String uploadedBy;
    private LocalDateTime createdAt;

    public static TaskDocumentResponse fromEntity(TaskDocument doc) {
        TaskDocumentResponse r = new TaskDocumentResponse();
        r.id = doc.getId();
        r.documentName = doc.getDocumentName();
        r.fileUrl = doc.getFileUrl();
        r.fileSize = doc.getFileSize();
        r.mimeType = doc.getMimeType();
        r.uploadedBy = doc.getUploadedBy() != null ? doc.getUploadedBy().getEmail() : null;
        r.createdAt = doc.getCreatedAt();
        return r;
    }

    // Getters
    public UUID getId() { return id; }
    public String getDocumentName() { return documentName; }
    public String getFileUrl() { return fileUrl; }
    public Long getFileSize() { return fileSize; }
    public String getMimeType() { return mimeType; }
    public String getUploadedBy() { return uploadedBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
