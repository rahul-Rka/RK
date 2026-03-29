package com.edutech.logisticsmanagementandtrackingsystem.repository;

/* =========================================================
   File: DriverRepository.java
   ========================================================= */

import org.springframework.data.jpa.repository.JpaRepository;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Driver;
import org.springframework.stereotype.Repository;
@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
}