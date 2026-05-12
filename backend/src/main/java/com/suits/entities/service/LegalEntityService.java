package com.suits.entities.service;

import com.suits.auth.entity.User;
import com.suits.auth.repository.UserRepository;
import com.suits.common.dto.PageResponse;
import com.suits.common.exception.ResourceNotFoundException;
import com.suits.entities.dto.LegalEntityRequest;
import com.suits.entities.dto.LegalEntityResponse;
import com.suits.entities.entity.LegalEntity;
import com.suits.entities.repository.LegalEntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class LegalEntityService {

    private final LegalEntityRepository repository;
    private final UserRepository userRepository;

    public LegalEntityService(LegalEntityRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<LegalEntityResponse> getAll(
            String search, String entityType, String state,
            String status, String complianceStatus, Pageable pageable) {

        Page<LegalEntity> page = repository.searchAndFilter(
            search, entityType, state, status, complianceStatus, pageable
        );
        return PageResponse.fromPage(page.map(LegalEntityResponse::fromEntity));
    }

    @Transactional(readOnly = true)
    public LegalEntityResponse getById(UUID id) {
        LegalEntity entity = repository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("LegalEntity", "id", id));
        return LegalEntityResponse.fromEntity(entity);
    }

    public LegalEntityResponse create(LegalEntityRequest req) {
        if (req.getCinLlpin() != null && repository.existsByCinLlpinAndDeletedAtIsNull(req.getCinLlpin())) {
            throw new IllegalArgumentException("Entity with CIN/LLPIN " + req.getCinLlpin() + " already exists");
        }
        if (req.getPan() != null && repository.existsByPanAndDeletedAtIsNull(req.getPan())) {
            throw new IllegalArgumentException("Entity with PAN " + req.getPan() + " already exists");
        }
        LegalEntity entity = toEntity(new LegalEntity(), req);
        entity = repository.save(entity);
        return LegalEntityResponse.fromEntity(entity);
    }

    public LegalEntityResponse update(UUID id, LegalEntityRequest req) {
        LegalEntity entity = repository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("LegalEntity", "id", id));
        toEntity(entity, req);
        entity = repository.save(entity);
        return LegalEntityResponse.fromEntity(entity);
    }

    public void delete(UUID id) {
        LegalEntity entity = repository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("LegalEntity", "id", id));
        entity.setDeletedAt(LocalDateTime.now());
        repository.save(entity);
    }

    private LegalEntity toEntity(LegalEntity e, LegalEntityRequest req) {
        e.setEntityName(req.getEntityName());
        e.setEntityType(LegalEntity.EntityTypeEnum.valueOf(req.getEntityType()));
        e.setIncorporationDate(req.getIncorporationDate());
        e.setCinLlpin(req.getCinLlpin());
        e.setPan(req.getPan());
        e.setTan(req.getTan());
        e.setGstin(req.getGstin());
        e.setRocCode(req.getRocCode());
        e.setFinancialYearEnd(req.getFinancialYearEnd() != null ? req.getFinancialYearEnd() : "March");
        e.setRegisteredOffice(req.getRegisteredOffice());
        e.setCity(req.getCity());
        e.setState(req.getState());
        e.setPincode(req.getPincode());
        e.setEmail(req.getEmail());
        e.setPhone(req.getPhone());
        e.setWebsite(req.getWebsite());
        e.setAuthorizedCapital(req.getAuthorizedCapital());
        e.setPaidUpCapital(req.getPaidUpCapital());
        e.setNotes(req.getNotes());
        if (req.getStatus() != null) {
            e.setStatus(LegalEntity.EntityStatusEnum.valueOf(req.getStatus()));
        }
        if (req.getTags() != null) {
            e.setTags(req.getTags().toArray(new String[0]));
        }
        if (req.getAssignedManagerId() != null) {
            User manager = userRepository.findById(UUID.fromString(req.getAssignedManagerId()))
                .orElse(null);
            e.setAssignedManager(manager);
        }
        return e;
    }
}
