package com.suits.clients.repository;

import com.suits.clients.entity.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClientRepository extends JpaRepository<Client, UUID> {

    Optional<Client> findByIdAndDeletedAtIsNull(UUID id);

    @Query("SELECT c FROM Client c WHERE c.deletedAt IS NULL AND c.name ILIKE %:name%")
    Page<Client> searchByName(String name, Pageable pageable);

    @Query("SELECT c FROM Client c WHERE c.deletedAt IS NULL ORDER BY c.createdAt DESC")
    Page<Client> findAllActive(Pageable pageable);

    @Query("SELECT c FROM Client c WHERE c.deletedAt IS NULL AND c.cin = :cin")
    Optional<Client> findByCinAndDeletedAtIsNull(String cin);

    @Query("SELECT c FROM Client c WHERE c.deletedAt IS NULL AND c.pan = :pan")
    Optional<Client> findByPanAndDeletedAtIsNull(String pan);
}
