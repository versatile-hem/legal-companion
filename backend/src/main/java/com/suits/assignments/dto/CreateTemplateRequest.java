package com.suits.assignments.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateTemplateRequest {
    @NotBlank(message = "Template name is required")
    private String name;
    
    private String description;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    private String complianceLevel; // BASIC, STANDARD, ENHANCED, CRITICAL
    
    private Integer estimatedDaysToComplete;
}
