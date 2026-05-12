package com.suits.assignments.dto;

import java.util.UUID;

public class RiskIndicatorDTO {
    private UUID assignmentId;
    private String riskLevel;
    private Integer riskScore;

    public UUID getAssignmentId() { return assignmentId; }
    public void setAssignmentId(UUID assignmentId) { this.assignmentId = assignmentId; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
}
