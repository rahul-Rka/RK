package com.edutech.logisticsmanagementandtrackingsystem.Controller;

import com.edutech.logisticsmanagementandtrackingsystem.entity.Cargo;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Customer;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Driver;
import com.edutech.logisticsmanagementandtrackingsystem.repository.CustomerRepository;
import com.edutech.logisticsmanagementandtrackingsystem.repository.DriverRepository;
import com.edutech.logisticsmanagementandtrackingsystem.service.BusinessService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    /* ✅ GET DRIVERS
       - if location passed: drivers available at that location
       - else: return all (as in your current project)
    */
    @GetMapping("/drivers")
    public List<Driver> getAllDrivers(@RequestParam(required = false) String location) {

        if (location != null && !location.trim().isEmpty()) {
            // ✅ This method was already used in your file, so we keep it
            return driverRepository.findByAvailableTrueAndCurrentLocationIgnoreCase(location.trim());
        }

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
                businessService.assignCargoToDriverAndCustomer(cargoId, driverId, customerId)
        );
    }

    /* =========================================================
       ✅ NEW: BUSINESS DASHBOARD - VIEW ALL FEEDBACKS
       URL: GET /api/business/feedbacks
       ========================================================= */
    @GetMapping("/feedbacks")
    public ResponseEntity<?> getAllFeedbacks() {
        try {
            return ResponseEntity.ok(businessService.getAllFeedbackCargos());
        } catch (Exception e) {
            String msg = (e.getMessage() == null || e.getMessage().trim().isEmpty())
                    ? "Failed to load feedback list"
                    : e.getMessage();
            return ResponseEntity.status(500).body(Map.of("message", msg));
        }
    }

    /* =========================================================
       ✅ NEW: BUSINESS DASHBOARD - FEEDBACK SUMMARY
       URL: GET /api/business/feedback-summary
       ========================================================= */
    @GetMapping("/feedback-summary")
    public ResponseEntity<?> getFeedbackSummary() {
        try {
            return ResponseEntity.ok(businessService.getFeedbackSummary());
        } catch (Exception e) {
            String msg = (e.getMessage() == null || e.getMessage().trim().isEmpty())
                    ? "Failed to load feedback summary"
                    : e.getMessage();
            return ResponseEntity.status(500).body(Map.of("message", msg));
        }
    }
}