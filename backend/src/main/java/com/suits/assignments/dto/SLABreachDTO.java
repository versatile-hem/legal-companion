package com.suits.assignments.dto;

import java.util.UUID;

public class SLABreachDTO {
    private UUID assignmentId;
    private String assignmentName;
    private Integer daysBreeched;

    public UUID getAssignmentId() { return assignmentId; }
    public void setAssignmentId(UUID assignmentId) { this.assignmentId = assignmentId; }
    public String getAssignmentName() { return assignmentName; }
    public void setAssignmentName(String assignmentName) { this.assignmentName = assignmentName; }
    public Integer getDaysBreeched() { return daysBreeched; }
    public void setDaysBreeched(Integer daysBreeched) { this.daysBreeched = daysBreeched; }
}
