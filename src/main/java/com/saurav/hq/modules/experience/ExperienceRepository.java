package com.saurav.hq.modules.experience;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, String> {
    List<Experience> findAllByOrderByDisplayOrderAsc();
}
