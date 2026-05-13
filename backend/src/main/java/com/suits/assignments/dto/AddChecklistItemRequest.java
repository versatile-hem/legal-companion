package com.suits.assignments.dto;

import jakarta.validation.constraints.NotBlank;

public class AddChecklistItemRequest {
    
    @NotBlank(message = "Checklist item name is required")
    private String name;
    
    private Integer order;
    
    public AddChecklistItemRequest() {}
    
    public AddChecklistItemRequest(String name, Integer order) {
        this.name = name;
        this.order = order;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public Integer getOrder() {
        return order;
    }
    
    public void setOrder(Integer order) {
        this.order = order;
    }
}
