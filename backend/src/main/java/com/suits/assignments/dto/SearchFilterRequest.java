package com.suits.assignments.dto;

import java.time.LocalDateTime;
import java.util.List;

public class SearchFilterRequest {
    private String query;
    private List<String> statuses;
    private List<String> priorities;
    private List<String> clients;
    private LocalDateTime createdAfter;
    private LocalDateTime createdBefore;
    private LocalDateTime dueAfter;
    private LocalDateTime dueBefore;
    private String assignedTo;
    private Boolean overdue;
    private Boolean slaBreached;
}
