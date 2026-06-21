package com.saurav.hq.gateway;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApiRouteDocRepository extends JpaRepository<ApiRouteDoc, String> {

    Optional<ApiRouteDoc> findByRouteId(String routeId);

    void deleteByRouteId(String routeId);

    boolean existsByRouteId(String routeId);
}
