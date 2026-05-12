package com.suits.assignments.dto;

import java.util.List;

public class OptimizationSuggestionsDTO {
    private String assignmentId;
    private List<String> parallelizableSteps;
    private List<String> resourceSuggestions;
    private List<String> urgentActions;
    private String potentialTimeSaving;
    private String overallRecommendation;
}
