package com.edutech.logisticsmanagementandtrackingsystem.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.edutech.logisticsmanagementandtrackingsystem.entity.Cargo;
import com.edutech.logisticsmanagementandtrackingsystem.service.CargoService;

@RestController
@RequestMapping("/api/driver")
@PreAuthorize("hasAuthority('DRIVER')")   // ✅ FIXED
public class DriverController {

    @Autowired
    private CargoService cargoService;

    @GetMapping("/cargo")
    public ResponseEntity<List<Cargo>> getAssignedCargos(
            @RequestParam(required = false) Long driverId) {

        return ResponseEntity.ok(
                cargoService.getByDriver(driverId)
        );
    }

    @PutMapping("/update-cargo-status")
    public ResponseEntity<Cargo> updateCargoStatus(
            @RequestParam(required = false) Long cargoId,
            @RequestParam(required = false) String newStatus) {

        return ResponseEntity.ok(
                cargoService.updateStatus(cargoId, newStatus)
        );
    }
}