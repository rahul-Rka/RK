package com.edutech.logisticsmanagementandtrackingsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Driver;

import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {

    Driver findByName(String name);

    List<Driver> findByAvailableTrue();

    // ✅ NEW: available + location match
    List<Driver> findByAvailableTrueAndCurrentLocationIgnoreCase(String currentLocation);
}
