package com.suits.billing.service;

import com.suits.billing.dto.InvoiceRequest;
import com.suits.billing.dto.InvoiceResponse;
import com.suits.billing.entity.Invoice;
import com.suits.billing.repository.InvoiceRepository;
import com.suits.clients.repository.ClientRepository;
import com.suits.common.dto.PageResponse;
import com.suits.common.exception.ResourceNotFoundException;
import com.suits.jobs.repository.ComplianceJobRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@Transactional
public class InvoiceService {

    private final InvoiceRepository repo;
    private final ClientRepository clientRepo;
    private final ComplianceJobRepository jobRepo;

    public InvoiceService(InvoiceRepository repo, ClientRepository clientRepo,
                          ComplianceJobRepository jobRepo) {
        this.repo = repo;
        this.clientRepo = clientRepo;
        this.jobRepo = jobRepo;
    }

    @Transactional(readOnly = true)
    public PageResponse<InvoiceResponse> filter(UUID clientId, String status, Pageable pageable) {
        Invoice.InvoiceStatus st = null;
        if (status != null && !status.isBlank()) {
            try { st = Invoice.InvoiceStatus.valueOf(status); } catch (IllegalArgumentException ignored) {}
        }
        return PageResponse.fromPage(
                repo.filter(clientId, st, pageable).map(InvoiceResponse::fromEntity));
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getById(UUID id) {
        return InvoiceResponse.fromEntity(find(id));
    }

    public InvoiceResponse create(InvoiceRequest req) {
        Invoice inv = new Invoice();
        map(req, inv);
        String num = "INV-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy")) +
                     "-" + String.format("%03d", repo.count() + 1);
        inv.setInvoiceNumber(num);
        computeTotal(inv, req);
        return InvoiceResponse.fromEntity(repo.save(inv));
    }

    public InvoiceResponse update(UUID id, InvoiceRequest req) {
        Invoice inv = find(id);
        map(req, inv);
        computeTotal(inv, req);
        return InvoiceResponse.fromEntity(repo.save(inv));
    }

    public void delete(UUID id) { repo.deleteById(id); }

    public record BillingSummary(BigDecimal totalPaid, BigDecimal totalOutstanding,
                                  long overdueCount, long draftCount) {}

    @Transactional(readOnly = true)
    public BillingSummary getSummary() {
        return new BillingSummary(
                repo.sumPaid(),
                repo.sumOutstanding(),
                repo.countByStatus(Invoice.InvoiceStatus.OVERDUE),
                repo.countByStatus(Invoice.InvoiceStatus.DRAFT));
    }

    private Invoice find(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));
    }

    private void map(InvoiceRequest req, Invoice inv) {
        if (req.getClientId() != null)
            clientRepo.findById(req.getClientId()).ifPresent(inv::setClient);
        if (req.getJobId() != null)
            jobRepo.findById(req.getJobId()).ifPresent(inv::setJob);
        inv.setAmount(req.getAmount());
        inv.setGstAmount(req.getGstAmount() != null ? req.getGstAmount() : BigDecimal.ZERO);
        if (req.getStatus() != null) inv.setStatus(Invoice.InvoiceStatus.valueOf(req.getStatus()));
        inv.setIssueDate(req.getIssueDate() != null ? req.getIssueDate() : LocalDate.now());
        inv.setDueDate(req.getDueDate());
        inv.setPaymentMode(req.getPaymentMode());
        inv.setNotes(req.getNotes());
    }

    private void computeTotal(Invoice inv, InvoiceRequest req) {
        BigDecimal gst = req.getGstAmount() != null ? req.getGstAmount() : BigDecimal.ZERO;
        inv.setTotalAmount(req.getAmount().add(gst));
    }
}
