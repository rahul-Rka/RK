package com.edutech.logisticsmanagementandtrackingsystem.Controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

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

    /*  CUSTOMER: VIEW OWN CARGOS */
    @GetMapping("/cargo")
    public ResponseEntity<List<Cargo>> getMyCargos(Authentication authentication) {

        String username = authentication.getName();
        Customer customer = customerRepository.findByName(username);

        if (customer == null) {
            return ResponseEntity.ok(List.of());
        }

        return ResponseEntity.ok(
                cargoRepository.findByCustomer_Id(customer.getId())
        );
    }

    /*  CUSTOMER: SUBMIT FEEDBACK (stored in cargo table)
       URL: POST /api/customer/submit-feedback?cargoId=2
       Body: { "rating": 5, "comment": "Good service" }
    */
    @PostMapping("/submit-feedback")
    public ResponseEntity<?> submitFeedback(
            @RequestParam Long cargoId,
            @RequestBody Map<String, Object> body,
            Authentication authentication) {

        String username = authentication.getName();
        Customer customer = customerRepository.findByName(username);

        if (customer == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Customer not found"));
        }

        Cargo cargo = cargoRepository.findById(cargoId).orElse(null);
        if (cargo == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cargo not found"));
        }

        //  Security: cargo must belong to logged-in customer
        if (cargo.getCustomer() == null || !cargo.getCustomer().getId().equals(customer.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Not allowed"));
        }

        //  Allow feedback only after delivered
        String status = cargo.getStatus() == null ? "" : cargo.getStatus().trim().toUpperCase();
        if (!"DELIVERED".equals(status)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Feedback allowed only after delivery"));
        }

        //  Prevent duplicate feedback
        if (cargo.getFeedbackRating() != null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Feedback already submitted"));
        }

        //  Validate rating 1..5
        Integer rating;
        try {
            rating = Integer.parseInt(String.valueOf(body.get("rating")));
        } catch (Exception e) {
            rating = null;
        }

        if (rating == null || rating < 1 || rating > 5) {
            return ResponseEntity.badRequest().body(Map.of("message", "Rating must be between 1 and 5"));
        }

        //  Comment optional, max 500 chars
        String comment = body.get("comment") == null ? "" : String.valueOf(body.get("comment")).trim();
        if (comment.length() > 500) {
            comment = comment.substring(0, 500);
        }

        cargo.setFeedbackRating(rating);
        cargo.setFeedbackComment(comment);
        cargo.setFeedbackDate(LocalDate.now());

        cargoRepository.save(cargo);

        return ResponseEntity.ok(Map.of("message", "Feedback submitted successfully"));
    }
}