package com.saurav.hq.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class ApiRouteService {

    private static final Logger log = LoggerFactory.getLogger(ApiRouteService.class);
    private final ApiRouteRepository repository;
    private final ApiRouteDocService docService;

    public ApiRouteService(ApiRouteRepository repository, ApiRouteDocService docService) {
        this.repository = repository;
        this.docService = docService;
    }

    public List<ApiRoute> getAll() { return repository.findAll(); }
    public List<ApiRoute> getByProject(String project) { return repository.findByProject(project); }
    public List<ApiRoute> getEnabled() { return repository.findByEnabled(true); }

    @Transactional
    public ApiRoute create(ApiRouteRequest req) {
        if (repository.existsByFullPathAndMethod(req.fullPath(), req.method())) {
            throw new IllegalArgumentException(
                    "Route already exists: [" + req.method() + "] " + req.fullPath());
        }
        ApiRoute route = ApiRoute.builder()
                .project(req.project())
                .module(req.module())
                .operation(req.operation())
                .fullPath(req.fullPath())
                .method(req.method().toUpperCase())
                .description(req.description())
                .tags(req.tags())
                .enabled(req.enabled())
                .requiresAuth(req.requiresAuth())
                .autoRegistered(false)
                .stale(false)
                .build();
        ApiRoute saved = repository.save(route);
        // Create empty doc entry for the new route
        docService.getOrCreate(saved.getId());
        return saved;
    }

    @Transactional
    public ApiRoute update(String id, ApiRouteRequest req) {
        ApiRoute route = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Route not found: " + id));
        route.setProject(req.project());
        route.setModule(req.module());
        route.setOperation(req.operation());
        route.setFullPath(req.fullPath());
        route.setMethod(req.method().toUpperCase());
        route.setDescription(req.description());
        route.setTags(req.tags());
        route.setEnabled(req.enabled());
        route.setRequiresAuth(req.requiresAuth());
        // When admin manually edits a stale route, clear the stale flag
        route.setStale(false);
        return repository.save(route);
    }

    @Transactional
    public void toggle(String id, boolean enabled) {
        ApiRoute route = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Route not found: " + id));
        route.setEnabled(enabled);
        repository.save(route);
        log.info("Route [{}] {} {}", route.getMethod(), route.getFullPath(),
                enabled ? "ENABLED" : "DISABLED");
    }

    @Transactional
    public void delete(String id) {
        if (!repository.existsById(id)) throw new IllegalArgumentException("Route not found: " + id);
        docService.deleteByRouteId(id);
        repository.deleteById(id);
    }

    /**
     * Called by RouteScanner on startup.
     * If the route is new → insert with autoRegistered=true and clear stale flag.
     * If it already exists → just ensure stale=false (it's still alive).
     */
    @Transactional
    public void registerOrUpdate(String fullPath, String method, String project,
                                  String module, String operation) {
        repository.findByFullPathAndMethod(fullPath, method).ifPresentOrElse(
                existing -> {
                    if (existing.isStale()) {
                        existing.setStale(false);
                        repository.save(existing);
                        log.info("Route revived (no longer stale): [{}] {}", method, fullPath);
                    }
                },
                () -> {
                    ApiRoute route = ApiRoute.builder()
                            .project(project)
                            .module(module)
                            .operation(operation)
                            .fullPath(fullPath)
                            .method(method.toUpperCase())
                            .enabled(true)
                            .autoRegistered(true)
                            .stale(false)
                            .build();
                    ApiRoute saved = repository.save(route);
                    docService.getOrCreate(saved.getId());
                    log.info("Auto-registered route: [{}] {}", method, fullPath);
                }
        );
    }

    /**
     * Called by RouteScanner after the scan pass.
     * Any auto-registered route NOT in the live set gets marked stale.
     */
    @Transactional
    public void markStaleIfNotIn(Set<String> liveKeys) {
        repository.findByAutoRegistered(true).forEach(route -> {
            String key = route.getMethod() + ":" + route.getFullPath();
            if (!liveKeys.contains(key) && !route.isStale()) {
                route.setStale(true);
                repository.save(route);
                log.warn("Route marked stale (no longer in app): [{}] {}", route.getMethod(), route.getFullPath());
            }
        });
    }

    public boolean isRouteEnabled(String path, String method) {
        return repository.findByFullPathAndMethod(path, method)
                .map(ApiRoute::isEnabled)
                .orElse(true);
    }
}
