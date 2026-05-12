package com.suits.assignments.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class NotificationDTO {
    private UUID id;
    private UUID userId;
    private String type;
    private String title;
    private String message;
    private Boolean read;
    private LocalDateTime createdAt;
    private String relatedEntityId;
    private String relatedEntityType;

    public NotificationDTO() {}

    public NotificationDTO(UUID id, UUID userId, String type, String title, String message, Boolean read, 
                           LocalDateTime createdAt, String relatedEntityId, String relatedEntityType) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.title = title;
        this.message = message;
        this.read = read;
        this.createdAt = createdAt;
        this.relatedEntityId = relatedEntityId;
        this.relatedEntityType = relatedEntityType;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Boolean getRead() { return read; }
    public void setRead(Boolean read) { this.read = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getRelatedEntityId() { return relatedEntityId; }
    public void setRelatedEntityId(String relatedEntityId) { this.relatedEntityId = relatedEntityId; }

    public String getRelatedEntityType() { return relatedEntityType; }
    public void setRelatedEntityType(String relatedEntityType) { this.relatedEntityType = relatedEntityType; }
}
