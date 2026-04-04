package com.edutech.logisticsmanagementandtrackingsystem.Controller;

import java.util.Collections;
import java.util.Map;

import com.edutech.logisticsmanagementandtrackingsystem.service.GmailServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class GmailController {

    @Autowired
    private GmailServices gmailService;

    @GetMapping("/sendotp")
    public ResponseEntity<String> sendOtp() {
        try {
            gmailService.sendOtp();
            return ResponseEntity.ok("OTP sent successfully");
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(ex.getMessage());
        }
    }

    @PostMapping("/verifyotp")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody Map<String, String> body) {
        try {
            String otp = body.get("otp");
            boolean ok = gmailService.validOtp(otp);

            if (ok) {
                return ResponseEntity.ok(Collections.singletonMap("message", "OTP Verified"));
            }
            return ResponseEntity.status(400).body(Collections.singletonMap("message", "Invalid or Expired OTP"));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Collections.singletonMap("message", ex.getMessage()));
        }
    }
}