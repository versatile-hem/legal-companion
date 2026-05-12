package com.suits.dashboard.service;

import com.suits.billing.repository.InvoiceRepository;
import com.suits.clients.repository.ClientRepository;
import com.suits.dashboard.dto.DashboardStats;
import com.suits.directors.repository.DirectorRepository;
import com.suits.entities.repository.LegalEntityRepository;
import com.suits.jobs.entity.ComplianceJob;
import com.suits.jobs.repository.ComplianceJobRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final ClientRepository clientRepo;
    private final LegalEntityRepository entityRepo;
    private final DirectorRepository directorRepo;
    private final ComplianceJobRepository jobRepo;
    private final InvoiceRepository invoiceRepo;

    public DashboardService(ClientRepository clientRepo, LegalEntityRepository entityRepo,
                             DirectorRepository directorRepo, ComplianceJobRepository jobRepo,
                             InvoiceRepository invoiceRepo) {
        this.clientRepo = clientRepo;
        this.entityRepo = entityRepo;
        this.directorRepo = directorRepo;
        this.jobRepo = jobRepo;
        this.invoiceRepo = invoiceRepo;
    }

    public DashboardStats getStats() {
        long totalClients = clientRepo.count();
        long totalEntities = entityRepo.count();
        long totalDirectors = directorRepo.count();

        long activeJobs = jobRepo.countByStatus(ComplianceJob.JobStatus.IN_PROGRESS)
                + jobRepo.countByStatus(ComplianceJob.JobStatus.PENDING_DOCS)
                + jobRepo.countByStatus(ComplianceJob.JobStatus.REVIEW);
        long overdueJobs = jobRepo.findOverdue().size();
        long completedJobs = jobRepo.countByStatus(ComplianceJob.JobStatus.COMPLETED)
                + jobRepo.countByStatus(ComplianceJob.JobStatus.FILED);

        var revenue = invoiceRepo.sumPaid();
        var outstanding = invoiceRepo.sumOutstanding();

        long kycPending = directorRepo.countByKycStatus(
                com.suits.directors.entity.Director.KycStatusEnum.PENDING);
        long kycOverdue = directorRepo.countByKycStatus(
                com.suits.directors.entity.Director.KycStatusEnum.OVERDUE);

        Map<String, Long> byStatus = Map.of(
                "DRAFT", jobRepo.countByStatus(ComplianceJob.JobStatus.DRAFT),
                "PENDING_DOCS", jobRepo.countByStatus(ComplianceJob.JobStatus.PENDING_DOCS),
                "IN_PROGRESS", jobRepo.countByStatus(ComplianceJob.JobStatus.IN_PROGRESS),
                "REVIEW", jobRepo.countByStatus(ComplianceJob.JobStatus.REVIEW),
                "FILED", jobRepo.countByStatus(ComplianceJob.JobStatus.FILED),
                "COMPLETED", jobRepo.countByStatus(ComplianceJob.JobStatus.COMPLETED),
                "REJECTED", jobRepo.countByStatus(ComplianceJob.JobStatus.REJECTED)
        );

        var recent = jobRepo.findRecent(PageRequest.of(0, 8)).stream()
                .map(j -> new DashboardStats.RecentActivityItem(
                        "JOB", j.getTitle(),
                        j.getEntity() != null ? j.getEntity().getEntityName() : "",
                        j.getUpdatedAt().toString(),
                        j.getStatus().name()))
                .collect(Collectors.toList());

        return new DashboardStats(totalClients, totalEntities, totalDirectors,
                activeJobs, overdueJobs, completedJobs, revenue, outstanding,
                kycPending, kycOverdue, byStatus, recent);
    }
}
