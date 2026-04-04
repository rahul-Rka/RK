package com.edutech.logisticsmanagementandtrackingsystem.Controller;

import com.edutech.logisticsmanagementandtrackingsystem.entity.User;
import com.edutech.logisticsmanagementandtrackingsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class RegisterAndLoginController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> req) {
        return userService.loginUser(req);
    }

    // ✅ RESET PASSWORD (EMAIL-BASED)
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> req) {

        String email = req.get("email");
        String newPassword = req.get("newPassword");

        // ✅ FIX: Your UserService expects only (email, newPassword)
        userService.resetPassword(email, newPassword);

        return ResponseEntity.ok("Password updated successfully");
    }
}