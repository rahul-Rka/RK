package com.edutech.logisticsmanagementandtrackingsystem.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.edutech.logisticsmanagementandtrackingsystem.entity.Cargo;
import com.edutech.logisticsmanagementandtrackingsystem.repository.CargoRepository;

@RestController
@RequestMapping("/api/customer")
@PreAuthorize("hasAuthority('CUSTOMER')")   // ✅ FIXED
public class CustomerController {

    @Autowired
    private CargoRepository cargoRepository;

    @GetMapping("/cargo-status")
    public ResponseEntity<Map<String, Object>> getCargoStatus(
            @RequestParam(required = false) Long cargoId) {

        if (cargoId == null) {
            return ResponseEntity.badRequest().build();
        }

        Cargo cargo = cargoRepository.findById(cargoId)
                .orElseThrow(() -> new RuntimeException("Cargo not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("cargoId", cargo.getId());
        response.put("status", cargo.getStatus());

        return ResponseEntity.ok(response);
    }
}