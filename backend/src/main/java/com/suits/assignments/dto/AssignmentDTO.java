package com.suits.assignments.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class AssignmentDTO {
    private UUID id;
    private String assignmentNumber;
    private UUID clientId;
    private String clientName;
    private String name;
    private String description;
    private String status;
    private String priority;
    private UUID ownerId;
    private String ownerName;
    private LocalDateTime targetCompletionDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer progressPercentage;
    private String complianceLevel;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getAssignmentNumber() { return assignmentNumber; }
    public void setAssignmentNumber(String assignmentNumber) { this.assignmentNumber = assignmentNumber; }
    public UUID getClientId() { return clientId; }
    public void setClientId(UUID clientId) { this.clientId = clientId; }
    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public UUID getOwnerId() { return ownerId; }
    public void setOwnerId(UUID ownerId) { this.ownerId = ownerId; }
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    public LocalDateTime getTargetCompletionDate() { return targetCompletionDate; }
    public void setTargetCompletionDate(LocalDateTime targetCompletionDate) { this.targetCompletionDate = targetCompletionDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public Integer getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Integer progressPercentage) { this.progressPercentage = progressPercentage; }
    public String getComplianceLevel() { return complianceLevel; }
    public void setComplianceLevel(String complianceLevel) { this.complianceLevel = complianceLevel; }
}
