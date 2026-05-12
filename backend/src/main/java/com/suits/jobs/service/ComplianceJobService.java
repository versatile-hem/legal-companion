package com.suits.jobs.service;

import com.suits.auth.repository.UserRepository;
import com.suits.clients.repository.ClientRepository;
import com.suits.common.dto.PageResponse;
import com.suits.common.exception.ResourceNotFoundException;
import com.suits.entities.repository.LegalEntityRepository;
import com.suits.jobs.dto.ComplianceJobRequest;
import com.suits.jobs.dto.ComplianceJobResponse;
import com.suits.jobs.entity.ComplianceJob;
import com.suits.jobs.repository.ComplianceJobRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ComplianceJobService {

    private final ComplianceJobRepository repo;
    private final LegalEntityRepository entityRepo;
    private final ClientRepository clientRepo;
    private final UserRepository userRepo;

    public ComplianceJobService(ComplianceJobRepository repo,
                                 LegalEntityRepository entityRepo,
                                 ClientRepository clientRepo,
                                 UserRepository userRepo) {
        this.repo = repo;
        this.entityRepo = entityRepo;
        this.clientRepo = clientRepo;
        this.userRepo = userRepo;
    }

    @Transactional(readOnly = true)
    public PageResponse<ComplianceJobResponse> filter(UUID entityId, UUID clientId,
                                                       String status, String jobType, Pageable pageable) {
        ComplianceJob.JobStatus st = parse(status, ComplianceJob.JobStatus.class);
        ComplianceJob.JobType jt = parse(jobType, ComplianceJob.JobType.class);
        var page = repo.filter(entityId, clientId, st, jt, pageable);
        return PageResponse.fromPage(page.map(ComplianceJobResponse::fromEntity));
    }

    @Transactional(readOnly = true)
    public ComplianceJobResponse getById(UUID id) {
        return ComplianceJobResponse.fromEntity(find(id));
    }

    @Transactional(readOnly = true)
    public List<ComplianceJobResponse> getOverdue() {
        return repo.findOverdue().stream().map(ComplianceJobResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ComplianceJobResponse> getRecent(int limit) {
        return repo.findRecent(PageRequest.of(0, limit)).stream()
                .map(ComplianceJobResponse::fromEntity).collect(Collectors.toList());
    }

    public ComplianceJobResponse create(ComplianceJobRequest req) {
        ComplianceJob job = new ComplianceJob();
        map(req, job);
        return ComplianceJobResponse.fromEntity(repo.save(job));
    }

    public ComplianceJobResponse update(UUID id, ComplianceJobRequest req) {
        ComplianceJob job = find(id);
        map(req, job);
        return ComplianceJobResponse.fromEntity(repo.save(job));
    }

    public ComplianceJobResponse updateStatus(UUID id, String status) {
        ComplianceJob job = find(id);
        job.setStatus(ComplianceJob.JobStatus.valueOf(status));
        if (job.getStatus() == ComplianceJob.JobStatus.COMPLETED ||
            job.getStatus() == ComplianceJob.JobStatus.FILED) {
            job.setCompletionDate(LocalDateTime.now());
        }
        return ComplianceJobResponse.fromEntity(repo.save(job));
    }

    public void delete(UUID id) { repo.deleteById(id); }

    private ComplianceJob find(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ComplianceJob", "id", id));
    }

    private void map(ComplianceJobRequest req, ComplianceJob job) {
        job.setTitle(req.getTitle());
        if (req.getJobType() != null) job.setJobType(ComplianceJob.JobType.valueOf(req.getJobType()));
        if (req.getStatus() != null) job.setStatus(ComplianceJob.JobStatus.valueOf(req.getStatus()));
        if (req.getPriority() != null) job.setPriority(ComplianceJob.Priority.valueOf(req.getPriority()));
        job.setDueDate(req.getDueDate());
        job.setFinancialYear(req.getFinancialYear());
        job.setBillingAmount(req.getBillingAmount());
        job.setRemarks(req.getRemarks());
        if (req.getEntityId() != null)
            entityRepo.findById(req.getEntityId()).ifPresent(job::setEntity);
        if (req.getClientId() != null)
            clientRepo.findById(req.getClientId()).ifPresent(job::setClient);
        if (req.getAssignedToId() != null)
            userRepo.findById(req.getAssignedToId()).ifPresent(job::setAssignedTo);
    }

    private <T extends Enum<T>> T parse(String val, Class<T> clazz) {
        if (val == null || val.isBlank()) return null;
        try { return Enum.valueOf(clazz, val); } catch (IllegalArgumentException e) { return null; }
    }
}
