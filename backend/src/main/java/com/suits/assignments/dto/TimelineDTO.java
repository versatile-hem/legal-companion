package com.suits.assignments.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class TimelineDTO {
    private UUID assignmentId;
    private LocalDateTime estimatedCompletion;
    private Integer daysRemaining;

    public UUID getAssignmentId() { return assignmentId; }
    public void setAssignmentId(UUID assignmentId) { this.assignmentId = assignmentId; }
    public LocalDateTime getEstimatedCompletion() { return estimatedCompletion; }
    public void setEstimatedCompletion(LocalDateTime estimatedCompletion) { this.estimatedCompletion = estimatedCompletion; }
    public Integer getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(Integer daysRemaining) { this.daysRemaining = daysRemaining; }
}
