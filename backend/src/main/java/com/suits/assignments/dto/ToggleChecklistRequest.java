package com.suits.assignments.dto;

public class ToggleChecklistRequest {
    
    private boolean completed;
    
    public ToggleChecklistRequest() {}
    
    public ToggleChecklistRequest(boolean completed) {
        this.completed = completed;
    }
    
    public boolean isCompleted() {
        return completed;
    }
    
    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
