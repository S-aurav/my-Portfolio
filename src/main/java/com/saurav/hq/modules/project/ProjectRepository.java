package com.saurav.hq.modules.project;

import com.saurav.hq.common.Visibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    List<Project> findByVisibilityOrderByDisplayOrderAscCreatedAtDesc(Visibility visibility);
}
