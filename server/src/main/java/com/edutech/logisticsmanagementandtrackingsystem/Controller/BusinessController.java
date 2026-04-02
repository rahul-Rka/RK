package com.edutech.logisticsmanagementandtrackingsystem.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.edutech.logisticsmanagementandtrackingsystem.entity.Cargo;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Driver;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Customer;
import com.edutech.logisticsmanagementandtrackingsystem.repository.CustomerRepository;
import com.edutech.logisticsmanagementandtrackingsystem.repository.DriverRepository;
import com.edutech.logisticsmanagementandtrackingsystem.service.BusinessService;

@RestController
@RequestMapping("/api/business")
@PreAuthorize("hasAuthority('BUSINESS')")
public class BusinessController {

    @Autowired
    private BusinessService businessService;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private CustomerRepository customerRepository;

    /* ✅ ADD CARGO */
    @PostMapping("/cargo")
    public ResponseEntity<Cargo> addCargo(@RequestBody Cargo cargo) {
        return ResponseEntity.ok(businessService.addCargo(cargo));
    }

    /* ✅ GET ALL DRIVERS */
    @GetMapping("/drivers")
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    /* ✅ GET ALL CUSTOMERS */
    @GetMapping("/customers")
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    /* ✅ GET ALL CARGO */
    @GetMapping("/cargo")
    public ResponseEntity<List<Cargo>> getAllCargo() {
        return ResponseEntity.ok(businessService.getAllCargo());
    }

    /* ✅ ASSIGN CARGO TO DRIVER + CUSTOMER */
    @PostMapping("/assign-cargo")
    public ResponseEntity<Cargo> assignCargo(
            @RequestParam Long cargoId,
            @RequestParam Long driverId,
            @RequestParam Long customerId) {

        return ResponseEntity.ok(
            businessService.assignCargoToDriverAndCustomer(
                cargoId, driverId, customerId
            )
        );
    }
}