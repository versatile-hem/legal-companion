package com.suits.assignments.dto;

import java.time.LocalDateTime;

public class InsightDTO {
    private String id;
    private String assignmentId;
    private String category; // RISK, OPTIMIZATION, TIMELINE, PATTERN
    private String insight;
    private String actionableRecommendation;
    private LocalDateTime generatedAt;
    private Integer confidenceScore;
}
