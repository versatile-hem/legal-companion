package com.suits.assignments.service;

import com.suits.assignments.entity.Assignment;
import com.suits.assignments.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.Optional;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    public Page<Assignment> getAllAssignments(Pageable pageable) {
        return assignmentRepository.findAll(pageable);
    }

    public Optional<Assignment> getAssignmentById(UUID id) {
        return assignmentRepository.findById(id);
    }

    public Assignment createAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    public Assignment updateAssignment(UUID id, Assignment assignmentDetails) {
        Optional<Assignment> assignment = assignmentRepository.findById(id);
        if (assignment.isPresent()) {
            Assignment existing = assignment.get();
            existing.setName(assignmentDetails.getName());
            existing.setDescription(assignmentDetails.getDescription());
            existing.setStatus(assignmentDetails.getStatus());
            existing.setPriority(assignmentDetails.getPriority());
            return assignmentRepository.save(existing);
        }
        return null;
    }

    public void deleteAssignment(UUID id) {
        assignmentRepository.deleteById(id);
    }
}
