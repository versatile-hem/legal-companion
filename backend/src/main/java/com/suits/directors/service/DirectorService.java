package com.suits.directors.service;

import com.suits.common.dto.PageResponse;
import com.suits.common.exception.ResourceNotFoundException;
import com.suits.directors.dto.DirectorRequest;
import com.suits.directors.dto.DirectorResponse;
import com.suits.directors.entity.Director;
import com.suits.directors.repository.DirectorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class DirectorService {

    private final DirectorRepository repo;

    public DirectorService(DirectorRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public PageResponse<DirectorResponse> getAll(String name, String kycStatus, Pageable pageable) {
        Director.KycStatusEnum kycEnum = null;
        if (kycStatus != null && !kycStatus.isBlank()) {
            try { kycEnum = Director.KycStatusEnum.valueOf(kycStatus); } catch (IllegalArgumentException ignored) {}
        }
        if ((name == null || name.isBlank()) && kycEnum == null) {
            Page<Director> page = repo.findAllActive(pageable);
            return PageResponse.fromPage(page.map(DirectorResponse::fromEntity));
        }
        Page<Director> page = repo.search(name, kycEnum, pageable);
        return PageResponse.fromPage(page.map(DirectorResponse::fromEntity));
    }

    @Transactional(readOnly = true)
    public DirectorResponse getById(UUID id) {
        return DirectorResponse.fromEntity(find(id));
    }

    @Transactional(readOnly = true)
    public List<DirectorResponse> getByEntityId(UUID entityId) {
        return repo.findByEntityId(entityId).stream()
                .map(DirectorResponse::fromEntity).collect(Collectors.toList());
    }

    public DirectorResponse create(DirectorRequest req) {
        Director d = new Director();
        map(req, d);
        return DirectorResponse.fromEntity(repo.save(d));
    }

    public DirectorResponse update(UUID id, DirectorRequest req) {
        Director d = find(id);
        map(req, d);
        return DirectorResponse.fromEntity(repo.save(d));
    }

    public void delete(UUID id) {
        Director d = find(id);
        d.setActive(false);
        repo.save(d);
    }

    private Director find(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Director", "id", id));
    }

    private void map(DirectorRequest req, Director d) {
        d.setFullName(req.getFullName());
        d.setDin(req.getDin());
        d.setPan(req.getPan());
        d.setAadhaar(req.getAadhaar());
        d.setEmail(req.getEmail());
        d.setPhone(req.getPhone());
        d.setDesignation(req.getDesignation());
        d.setNationality(req.getNationality());
        d.setKycDueDate(req.getKycDueDate());
        d.setDscValidUntil(req.getDscValidUntil());
        d.setNotes(req.getNotes());
        if (req.getKycStatus() != null) {
            try { d.setKycStatus(Director.KycStatusEnum.valueOf(req.getKycStatus())); }
            catch (IllegalArgumentException ignored) {}
        }
        if (req.getIsActive() != null) d.setActive(req.getIsActive());
    }
}
