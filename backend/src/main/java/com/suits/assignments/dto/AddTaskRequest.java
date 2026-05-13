package com.suits.assignments.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;

public class AddTaskRequest {
    
    @NotBlank(message = "Task title is required")
    private String title;
    
    private String description;
    
    private LocalDate dueDate;
    
    private BigDecimal estimatedFee;
    
    private BigDecimal outOfPocketExpense;
    
    private String taskCategory;
    
    private String taskTemplate;
    
    public AddTaskRequest() {}
    
    public AddTaskRequest(String title, String description, LocalDate dueDate) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDate getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    
    public BigDecimal getEstimatedFee() {
        return estimatedFee;
    }
    
    public void setEstimatedFee(BigDecimal estimatedFee) {
        this.estimatedFee = estimatedFee;
    }
    
    public BigDecimal getOutOfPocketExpense() {
        return outOfPocketExpense;
    }
    
    public void setOutOfPocketExpense(BigDecimal outOfPocketExpense) {
        this.outOfPocketExpense = outOfPocketExpense;
    }
    
    public String getTaskCategory() {
        return taskCategory;
    }
    
    public void setTaskCategory(String taskCategory) {
        this.taskCategory = taskCategory;
    }
    
    public String getTaskTemplate() {
        return taskTemplate;
    }
    
    public void setTaskTemplate(String taskTemplate) {
        this.taskTemplate = taskTemplate;
    }
}
