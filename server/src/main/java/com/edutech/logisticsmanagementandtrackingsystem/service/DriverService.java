package com.edutech.logisticsmanagementandtrackingsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.logisticsmanagementandtrackingsystem.entity.Driver;
import com.edutech.logisticsmanagementandtrackingsystem.repository.DriverRepository;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    // ✅ NEW: only available drivers
    public List<Driver> getAvailableDrivers() {
        return driverRepository.findByAvailableTrue();
    }

    public Driver saveDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    // ✅ NEW: toggle availability based on JWT username
    @Transactional
    public Driver toggleAvailability(String username) {
        Driver driver = driverRepository.findByName(username);
        if (driver == null) {
            throw new RuntimeException("Driver not found");
        }
        driver.setAvailable(!driver.isAvailable());
        return driverRepository.save(driver);
    }

    // ✅ NEW (optional): update current location
    @Transactional
    public Driver updateLocation(String username, String location) {
        Driver driver = driverRepository.findByName(username);
        if (driver == null) {
            throw new RuntimeException("Driver not found");
        }
        driver.setCurrentLocation(location);
        return driverRepository.save(driver);
    }
    public Driver getDriverProfile(String username) {
    return driverRepository.findByName(username);
}
}
