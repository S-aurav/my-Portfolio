package com.saurav.hq.gateway;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApiRouteRepository extends JpaRepository<ApiRoute, String> {

    List<ApiRoute> findByProject(String project);

    List<ApiRoute> findByProjectAndModule(String project, String module);

    List<ApiRoute> findByEnabled(boolean enabled);

    List<ApiRoute> findByAutoRegistered(boolean autoRegistered);

    Optional<ApiRoute> findByFullPathAndMethod(String fullPath, String method);

    boolean existsByFullPathAndMethod(String fullPath, String method);
}
