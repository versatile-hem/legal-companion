package com.suits.assignments.dto;

import com.suits.assignments.entity.TaskChecklist;
import java.time.LocalDateTime;
import java.util.UUID;

public class TaskChecklistItemResponse {
    private UUID id;
    private String name;
    private Boolean isCompleted;
    private Integer order;
    private LocalDateTime completedAt;
    private String completedBy;

    public static TaskChecklistItemResponse fromEntity(TaskChecklist item) {
        TaskChecklistItemResponse r = new TaskChecklistItemResponse();
        r.id = item.getId();
        r.name = item.getName();
        r.isCompleted = item.getIsCompleted();
        r.order = item.getOrder();
        r.completedAt = item.getCompletedAt();
        r.completedBy = item.getCompletedBy() != null ? item.getCompletedBy().getEmail() : null;
        return r;
    }

    // Getters
    public UUID getId() { return id; }
    public String getName() { return name; }
    public Boolean getIsCompleted() { return isCompleted; }
    public Integer getOrder() { return order; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public String getCompletedBy() { return completedBy; }
    
    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setIsCompleted(Boolean isCompleted) { this.isCompleted = isCompleted; }
    public void setOrder(Integer order) { this.order = order; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public void setCompletedBy(String completedBy) { this.completedBy = completedBy; }
}
