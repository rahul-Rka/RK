package com.edutech.logisticsmanagementandtrackingsystem.repository;

/* =========================================================
   File: CargoRepository.java
   ========================================================= */

import org.springframework.data.jpa.repository.JpaRepository;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Cargo;
import java.util.List;
import org.springframework.stereotype.Repository;
@Repository
public interface CargoRepository extends JpaRepository<Cargo, Long> {
    List<Cargo> findByDriver_Id(Long driverId);
}