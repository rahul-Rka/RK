package com.edutech.logisticsmanagementandtrackingsystem.service;

/* =========================================================
   File: DriverService.java
   ========================================================= */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.edutech.logisticsmanagementandtrackingsystem.entity.Driver;
import com.edutech.logisticsmanagementandtrackingsystem.repository.DriverRepository;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    // ✅ View all drivers
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }
    public Driver saveDriver(Driver driver) {
        return driverRepository.save(driver);
    }
}