package com.edutech.logisticsmanagementandtrackingsystem.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.edutech.logisticsmanagementandtrackingsystem.entity.Cargo;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Customer;
import com.edutech.logisticsmanagementandtrackingsystem.repository.CargoRepository;
import com.edutech.logisticsmanagementandtrackingsystem.repository.CustomerRepository;

@RestController
@RequestMapping("/api/customer")
@PreAuthorize("hasAuthority('CUSTOMER')")
public class CustomerController {

    @Autowired
    private CargoRepository cargoRepository;

    @Autowired
    private CustomerRepository customerRepository;

    /* ✅ CUSTOMER-SPECIFIC DASHBOARD */
    @GetMapping("/cargo")
    public ResponseEntity<List<Cargo>> getMyCargos(
            Authentication authentication) {

        String username = authentication.getName();

        Customer customer = customerRepository.findByName(username);

        if (customer == null) {
            return ResponseEntity.ok(List.of()); // ✅ safe fallback
        }

        return ResponseEntity.ok(
            cargoRepository.findByCustomer_Id(customer.getId())
        );
    }
}