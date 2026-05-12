package com.suits.assignments.repository;

import com.suits.assignments.entity.AssignmentTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssignmentTemplateRepository extends JpaRepository<AssignmentTemplate, UUID> {
    Page<AssignmentTemplate> findByPublishedTrue(Pageable pageable);
    Page<AssignmentTemplate> findByCategory(String category, Pageable pageable);
    Page<AssignmentTemplate> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String name, String description, Pageable pageable);
}
