package com.edutech.logisticsmanagementandtrackingsystem.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.edutech.logisticsmanagementandtrackingsystem.entity.Cargo;
import com.edutech.logisticsmanagementandtrackingsystem.service.CargoService;

@RestController
@RequestMapping("/api/driver")
@PreAuthorize("hasAuthority('DRIVER')")   // ✅ ENABLE SECURITY
public class DriverController {

    @Autowired
    private CargoService cargoService;

    /* ✅ DRIVER DASHBOARD */
    @GetMapping("/cargo")
    public ResponseEntity<List<Cargo>> getAssignedCargos(
            Authentication authentication) {

        String username = authentication.getName();

        return ResponseEntity.ok(
            cargoService.getCargosForLoggedInDriver(username)
        );
    }

    /* ✅ DRIVER CAN UPDATE ONLY OWN CARGO */
    @PutMapping("/update-cargo-status")
    public ResponseEntity<Cargo> updateCargoStatus(
            Authentication authentication,
            @RequestParam Long cargoId,
            @RequestParam String newStatus) {

        String username = authentication.getName();

        return ResponseEntity.ok(
            cargoService.updateStatusForDriver(cargoId, newStatus, username)
        );
    }
}