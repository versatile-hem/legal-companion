package com.suits.assignments.dto;

import java.time.LocalDateTime;

public class TimelineEstimateDTO {
    private String assignmentId;
    private LocalDateTime estimatedCompletion;
    private Integer completionPercentage;
    private Integer daysRemaining;
    private String confidence; // LOW, MEDIUM, HIGH
    private String reasoning;
}
