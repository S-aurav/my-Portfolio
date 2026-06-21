package com.saurav.hq.modules.project;

import com.saurav.hq.common.Visibility;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProjectService {

    private final ProjectRepository repository;

    public ProjectService(ProjectRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Project> getPublicProjects() {
        return repository.findByVisibilityOrderByDisplayOrderAscCreatedAtDesc(Visibility.PUBLIC);
    }

    @Transactional(readOnly = true)
    public List<Project> getAllProjects() {
        return repository.findAll();
    }

    public Project createProject(ProjectRequest req) {
        Project project = new Project();
        updateEntityFromRequest(project, req);
        return repository.save(project);
    }

    public Project updateProject(String id, ProjectRequest req) {
        Project project = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + id));
        updateEntityFromRequest(project, req);
        return repository.save(project);
    }

    public void deleteProject(String id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Project not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private void updateEntityFromRequest(Project entity, ProjectRequest req) {
        if (req.title() == null || req.title().isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (req.description() == null || req.description().isBlank()) {
            throw new IllegalArgumentException("Description is required");
        }

        entity.setTitle(req.title().trim());
        entity.setDescription(req.description().trim());
        entity.setDate(req.date() != null ? req.date().trim() : null);
        entity.setGithubUrl(req.githubUrl() != null ? req.githubUrl().trim() : null);
        entity.setDemoUrl(req.demoUrl() != null ? req.demoUrl().trim() : null);
        entity.setTechStack(req.techStack() != null ? req.techStack().trim() : null);
        entity.setVisibility(req.visibility() != null ? req.visibility() : Visibility.PUBLIC);
        entity.setDisplayOrder(req.displayOrder() != null ? req.displayOrder() : 0);
    }
}
