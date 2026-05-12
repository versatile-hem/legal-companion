package com.suits.billing.dto;

import com.suits.billing.entity.Invoice;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class InvoiceResponse {
    private UUID id;
    private String invoiceNumber;
    private UUID clientId;
    private String clientName;
    private UUID jobId;
    private String jobTitle;
    private BigDecimal amount;
    private BigDecimal gstAmount;
    private BigDecimal totalAmount;
    private String status;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private LocalDate paidDate;
    private String paymentMode;
    private String notes;
    private LocalDateTime createdAt;

    public static InvoiceResponse fromEntity(Invoice i) {
        InvoiceResponse r = new InvoiceResponse();
        r.id = i.getId();
        r.invoiceNumber = i.getInvoiceNumber();
        if (i.getClient() != null) { r.clientId = i.getClient().getId(); r.clientName = i.getClient().getName(); }
        if (i.getJob() != null) { r.jobId = i.getJob().getId(); r.jobTitle = i.getJob().getTitle(); }
        r.amount = i.getAmount();
        r.gstAmount = i.getGstAmount();
        r.totalAmount = i.getTotalAmount();
        r.status = i.getStatus() != null ? i.getStatus().name() : null;
        r.issueDate = i.getIssueDate();
        r.dueDate = i.getDueDate();
        r.paidDate = i.getPaidDate();
        r.paymentMode = i.getPaymentMode();
        r.notes = i.getNotes();
        r.createdAt = i.getCreatedAt();
        return r;
    }

    // Getters
    public UUID getId() { return id; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public UUID getClientId() { return clientId; }
    public String getClientName() { return clientName; }
    public UUID getJobId() { return jobId; }
    public String getJobTitle() { return jobTitle; }
    public BigDecimal getAmount() { return amount; }
    public BigDecimal getGstAmount() { return gstAmount; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public String getStatus() { return status; }
    public LocalDate getIssueDate() { return issueDate; }
    public LocalDate getDueDate() { return dueDate; }
    public LocalDate getPaidDate() { return paidDate; }
    public String getPaymentMode() { return paymentMode; }
    public String getNotes() { return notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
