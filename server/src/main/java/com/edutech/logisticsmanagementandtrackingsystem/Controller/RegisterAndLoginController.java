package com.edutech.logisticsmanagementandtrackingsystem.Controller;

import com.edutech.logisticsmanagementandtrackingsystem.entity.User;
import com.edutech.logisticsmanagementandtrackingsystem.service.GmailServices;
import com.edutech.logisticsmanagementandtrackingsystem.service.PendingLoginStore;
import com.edutech.logisticsmanagementandtrackingsystem.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RegisterAndLoginController {

    @Autowired
    private UserService userService;

    @Autowired
    private GmailServices gmailServices;

    @Autowired
    private PendingLoginStore pendingLoginStore;

    /* =========================
        REGISTER
       ========================= */
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    /* =========================
       ✅ LOGIN (STEP-1 OTP FLOW)
       =========================
       - validates username/password via userService.loginUser()
       - sends OTP to user's email
       - returns { otpRequired: true, challengeId }
       - token will be released only after OTP verification
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> req) {

        // Validate credentials first (your existing JWT login logic)
        Map<String, Object> loginResult = userService.loginUser(req);

        String username = req.get("username");
        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username missing"));
        }

        // Get user email from DB
        String email = userService.getEmailByUsername(username);

        // Send OTP and get challengeId
        String challengeId = gmailServices.generateAndSendOtp(email);

        // Store token + role temporarily until OTP verified
        pendingLoginStore.put(challengeId, (String) loginResult.get("token"), loginResult.get("role"));

        // OTP-required response (NO token returned yet)
        Map<String, Object> response = new HashMap<>();
        response.put("otpRequired", true);
        response.put("challengeId", challengeId);

        return ResponseEntity.ok(response);
    }

    /* =========================
       ✅ VERIFY OTP (STEP-2)
       =========================
       - verifies OTP using challengeId
       - if ok, returns { token, role, message }
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, String> body) {

        String challengeId = body.get("challengeId");
        String otp = body.get("otp");

        if (challengeId == null || challengeId.trim().isEmpty() || otp == null || otp.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "challengeId and otp are required"));
        }

        boolean ok = gmailServices.verifyOtp(challengeId, otp);
        if (!ok) {
            return ResponseEntity.status(400).body(Map.of("message", "Invalid or Expired OTP"));
        }

        PendingLoginStore.PendingLogin pending = pendingLoginStore.get(challengeId);
        if (pending == null) {
            return ResponseEntity.status(400).body(Map.of("message", "Session expired. Please login again."));
        }

        // cleanup
        pendingLoginStore.remove(challengeId);
        gmailServices.removeChallenge(challengeId);

        // Return token + role
        Map<String, Object> res = new HashMap<>();
        res.put("token", pending.getToken());
        res.put("role", pending.getRole());
        res.put("message", "Login successful");

        return ResponseEntity.ok(res);
    }

    /* =========================
       ✅ RESET PASSWORD (EMAIL-BASED)
       ========================= */
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> req) {

        String email = req.get("email");
        String newPassword = req.get("newPassword");

        userService.resetPassword(email, newPassword);

        return ResponseEntity.ok("Password updated successfully");
    }
}