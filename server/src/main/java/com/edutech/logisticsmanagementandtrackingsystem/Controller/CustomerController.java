package com.edutech.logisticsmanagementandtrackingsystem.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.edutech.logisticsmanagementandtrackingsystem.service.CustomerService;

@RestController
@RequestMapping("/api/customer")
// @PreAuthorize("hasAuthority('CUSTOMER')")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping("/cargo-status")
    public ResponseEntity<Map<String, Object>> getCargoStatus(
            @RequestParam Long cargoId) {

        return ResponseEntity.ok(
                customerService.getCargoStatus(cargoId)
        );
    }
}