package com.suits.assignments.entity;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "assignment_templates")
public class AssignmentTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 100)
    private String category;

    // complianceLevel: removed as it doesn't exist in database schema
    @Transient
    private String complianceLevel;

    @Column(name = "is_published", nullable = false)
    private Boolean published = false;

    @Column(name = "estimated_duration_days")
    private Integer estimatedDaysToComplete;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Constructor
    public AssignmentTemplate() {}

    // Getters & Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getComplianceLevel() { return complianceLevel; }
    public void setComplianceLevel(String complianceLevel) { this.complianceLevel = complianceLevel; }

    public Boolean getPublished() { return published; }
    public void setPublished(Boolean published) { this.published = published; }

    public Integer getEstimatedDaysToComplete() { return estimatedDaysToComplete; }
    public void setEstimatedDaysToComplete(Integer estimatedDaysToComplete) { 
        this.estimatedDaysToComplete = estimatedDaysToComplete; 
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
