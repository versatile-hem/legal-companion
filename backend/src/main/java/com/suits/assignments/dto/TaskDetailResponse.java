package com.suits.assignments.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class TaskDetailResponse {
    
    private UUID id;
    private String title;
    private String description;
    private String status;
    private LocalDate dueDate;
    
    // Financial fields
    private BigDecimal estimatedFee;
    private BigDecimal outOfPocketExpense;
    private String taskCategory;
    private String taskTemplate;
    
    // Referenced items
    private List<TaskDocumentResponse> documents;
    private List<TaskChecklistItemResponse> checklists;
    
    public TaskDetailResponse() {}
    
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
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
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
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
    
    public List<TaskDocumentResponse> getDocuments() {
        return documents;
    }
    
    public void setDocuments(List<TaskDocumentResponse> documents) {
        this.documents = documents;
    }
    
    public List<TaskChecklistItemResponse> getChecklists() {
        return checklists;
    }
    
    public void setChecklists(List<TaskChecklistItemResponse> checklists) {
        this.checklists = checklists;
    }
}
