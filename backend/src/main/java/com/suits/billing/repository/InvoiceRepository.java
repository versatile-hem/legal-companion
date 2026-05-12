package com.suits.billing.repository;

import com.suits.billing.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {

    Page<Invoice> findByClientId(UUID clientId, Pageable pageable);

    @Query("SELECT i FROM Invoice i WHERE " +
           "(:clientId IS NULL OR i.client.id = :clientId) AND " +
           "(:status IS NULL OR i.status = :status)")
    Page<Invoice> filter(@Param("clientId") UUID clientId,
                         @Param("status") Invoice.InvoiceStatus status,
                         Pageable pageable);

    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i WHERE i.status = 'PAID'")
    BigDecimal sumPaid();

    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i WHERE i.status IN ('SENT','OVERDUE')")
    BigDecimal sumOutstanding();

    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.status = :status")
    long countByStatus(@Param("status") Invoice.InvoiceStatus status);
}
