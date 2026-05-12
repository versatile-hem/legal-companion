package com.suits.assignments.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class TemplateDTO {
    private UUID id;
    private String name;
    private String description;
    private String category;
    private String complianceLevel;
    private Integer estimatedDaysToComplete;
    private Boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
