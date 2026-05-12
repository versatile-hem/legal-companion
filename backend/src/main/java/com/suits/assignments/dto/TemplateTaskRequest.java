package com.suits.assignments.dto;

import jakarta.validation.constraints.NotBlank;

public class TemplateTaskRequest {
    @NotBlank(message = "Task title is required")
    private String title;
    
    private String description;
    
    private Integer sequence;
    
    private String priority;
    
    private Integer estimatedDays;
    
    private Boolean mandatory;
}
