package com.edutech.logisticsmanagementandtrackingsystem.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.edutech.logisticsmanagementandtrackingsystem.entity.Cargo;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Driver;
import com.edutech.logisticsmanagementandtrackingsystem.repository.DriverRepository;
import com.edutech.logisticsmanagementandtrackingsystem.service.BusinessService;

@RestController
@RequestMapping("/api/business")
// @PreAuthorize("hasAuthority('BUSINESS')")
public class BusinessController {

    @Autowired
    private BusinessService businessService;

    @Autowired
    private DriverRepository driverRepository;

    /* ✅ ADD CARGO */
    @PostMapping("/cargo")
    public ResponseEntity<Cargo> addCargo(@RequestBody Cargo cargo) {
        return ResponseEntity.ok(businessService.addCargo(cargo));
    }

    @GetMapping("/drivers")
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    /* ✅ GET ALL CARGO */
    @GetMapping("/cargo")
    public ResponseEntity<List<Cargo>> getAllCargo() {
        return ResponseEntity.ok(businessService.getAllCargo());
    }

    /* ✅ ASSIGN CARGO */
    @PostMapping("/assign-cargo")
    public ResponseEntity<Cargo> assignCargoToDriver(
            @RequestParam Long cargoId,
            @RequestParam Long driverId) {

        return ResponseEntity.ok(businessService.assignCargoToDriver(cargoId, driverId));
    }
}