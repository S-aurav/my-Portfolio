package com.saurav.hq.modules.certification;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CertificationService {

    private final CertificationRepository repository;

    public CertificationService(CertificationRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Certification> getAllCertifications() {
        return repository.findAllByOrderByDisplayOrderAsc();
    }

    public Certification createCertification(CertificationRequest req) {
        Certification certification = new Certification();
        updateEntityFromRequest(certification, req);
        return repository.save(certification);
    }

    public Certification updateCertification(String id, CertificationRequest req) {
        Certification certification = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Certification not found with id: " + id));
        updateEntityFromRequest(certification, req);
        return repository.save(certification);
    }

    public void deleteCertification(String id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Certification not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private void updateEntityFromRequest(Certification entity, CertificationRequest req) {
        if (req.name() == null || req.name().isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        entity.setName(req.name().trim());
        entity.setDisplayOrder(req.displayOrder());
    }
}
