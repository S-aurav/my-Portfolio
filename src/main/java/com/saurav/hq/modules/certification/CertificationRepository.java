package com.saurav.hq.modules.certification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, String> {
    List<Certification> findAllByOrderByDisplayOrderAsc();
}
