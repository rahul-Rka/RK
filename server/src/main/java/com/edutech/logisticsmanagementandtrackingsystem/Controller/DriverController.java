package com.edutech.logisticsmanagementandtrackingsystem.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.edutech.logisticsmanagementandtrackingsystem.entity.Cargo;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Driver;
import com.edutech.logisticsmanagementandtrackingsystem.service.CargoService;
import com.edutech.logisticsmanagementandtrackingsystem.service.DriverService;

@RestController
@RequestMapping("/api/driver")
@PreAuthorize("hasAuthority('DRIVER')")
public class DriverController {

    @Autowired
    private CargoService cargoService;

    @Autowired
    private DriverService driverService;

    @GetMapping("/cargo")
    public ResponseEntity<List<Cargo>> getAssignedCargos(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(cargoService.getCargosForLoggedInDriver(username));
    }

    @PutMapping("/update-cargo-status")
    public ResponseEntity<Cargo> updateCargoStatus(
            Authentication authentication,
            @RequestParam Long cargoId,
            @RequestParam String newStatus) {

        String username = authentication.getName();
        return ResponseEntity.ok(cargoService.updateStatusForDriver(cargoId, newStatus, username));
    }

    // ✅ NEW: toggle availability
    @PostMapping("/availability/toggle")
    public ResponseEntity<Driver> toggleAvailability(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(driverService.toggleAvailability(username));
    }

    // ✅ NEW: update location (optional)
    @PutMapping("/location")
    public ResponseEntity<Driver> updateLocation(
            Authentication authentication,
            @RequestBody Map<String, String> body) {

        String username = authentication.getName();
        String location = body.getOrDefault("currentLocation", "");
        return ResponseEntity.ok(driverService.updateLocation(username, location));
    }
}
