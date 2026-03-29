package com.edutech.logisticsmanagementandtrackingsystem.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.edutech.logisticsmanagementandtrackingsystem.entity.Cargo;
import com.edutech.logisticsmanagementandtrackingsystem.repository.CargoRepository;
import com.edutech.logisticsmanagementandtrackingsystem.service.CargoService;

@RestController
@RequestMapping("/api/business")
@PreAuthorize("hasAuthority('BUSINESS')")   // ✅ FIXED
public class BusinessController {

    @Autowired
    private CargoService cargoService;

    @Autowired
    private CargoRepository cargoRepository;

    @PostMapping("/cargo")
    public ResponseEntity<Cargo> addCargo(
            @RequestBody(required = false) Cargo cargo) {

        if (cargo == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                cargoService.addCargo(cargo)
        );
    }

    @GetMapping("/cargo")
    public ResponseEntity<List<Cargo>> getAllCargo() {
        return ResponseEntity.ok(
                cargoRepository.findAll()
        );
    }

    @PostMapping("/assign-cargo")
    public ResponseEntity<Cargo> assignCargoToDriver(
            @RequestParam(required = false) Long cargoId,
            @RequestParam(required = false) Long driverId) {

        return ResponseEntity.ok(
                cargoService.assignCargoToDriver(cargoId, driverId)
        );
    }
}