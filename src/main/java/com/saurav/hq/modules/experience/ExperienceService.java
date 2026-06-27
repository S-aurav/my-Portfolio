package com.saurav.hq.modules.experience;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ExperienceService {

    private final ExperienceRepository repository;

    public ExperienceService(ExperienceRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Experience> getAllExperiences() {
        return repository.findAllByOrderByDisplayOrderAsc();
    }

    public Experience createExperience(ExperienceRequest req) {
        Experience experience = new Experience();
        updateEntityFromRequest(experience, req);
        return repository.save(experience);
    }

    public Experience updateExperience(String id, ExperienceRequest req) {
        Experience experience = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Experience not found with id: " + id));
        updateEntityFromRequest(experience, req);
        return repository.save(experience);
    }

    public void deleteExperience(String id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Experience not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private void updateEntityFromRequest(Experience entity, ExperienceRequest req) {
        if (req.role() == null || req.role().isBlank()) {
            throw new IllegalArgumentException("Role is required");
        }
        if (req.company() == null || req.company().isBlank()) {
            throw new IllegalArgumentException("Company is required");
        }
        if (req.type() == null || req.type().isBlank()) {
            throw new IllegalArgumentException("Type is required");
        }
        entity.setRole(req.role().trim());
        entity.setCompany(req.company().trim());
        entity.setDuration(req.duration());
        entity.setLocation(req.location());
        entity.setType(req.type().trim());
        entity.setHighlights(req.highlights());
        entity.setTechStack(req.techStack());
        entity.setDisplayOrder(req.displayOrder());
    }
}
