package com.suits.assignments.dto;

public class SLAStatusDTO {
    private String assignmentId;
    private String status;
    private Integer daysRemaining;

    public String getAssignmentId() { return assignmentId; }
    public void setAssignmentId(String assignmentId) { this.assignmentId = assignmentId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(Integer daysRemaining) { this.daysRemaining = daysRemaining; }
}
