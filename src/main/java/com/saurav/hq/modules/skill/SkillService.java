package com.saurav.hq.modules.skill;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SkillService {

    private final SkillRepository repository;

    public SkillService(SkillRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Skill> getAllSkills() {
        return repository.findAllByOrderByDisplayOrderAsc();
    }

    public Skill createSkill(SkillRequest req) {
        Skill skill = new Skill();
        updateEntityFromRequest(skill, req);
        return repository.save(skill);
    }

    public Skill updateSkill(String id, SkillRequest req) {
        Skill skill = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Skill not found with id: " + id));
        updateEntityFromRequest(skill, req);
        return repository.save(skill);
    }

    public void deleteSkill(String id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Skill not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private void updateEntityFromRequest(Skill entity, SkillRequest req) {
        if (req.category() == null || req.category().isBlank()) {
            throw new IllegalArgumentException("Category is required");
        }
        if (req.name() == null || req.name().isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        entity.setCategory(req.category().trim());
        entity.setName(req.name().trim());
        entity.setDisplayOrder(req.displayOrder());
    }
}
