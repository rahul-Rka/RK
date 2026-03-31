package com.edutech.logisticsmanagementandtrackingsystem.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

import com.edutech.logisticsmanagementandtrackingsystem.entity.*;
import com.edutech.logisticsmanagementandtrackingsystem.jwt.JwtUtil;
import com.edutech.logisticsmanagementandtrackingsystem.repository.*;
import com.edutech.logisticsmanagementandtrackingsystem.service.UserService;

@RestController
@RequestMapping("/api")
public class RegisterAndLoginController {

    @Autowired
    private UserService userService;

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private JwtUtil jwtUtil;

    // ✅ REGISTER
    @PostMapping("/register")
    public Object register(@RequestBody User user) {

        User savedUser = userService.register(user);

        if ("BUSINESS".equalsIgnoreCase(user.getRole())) {
            Business b = new Business();
            b.setName(savedUser.getUsername());
            b.setEmail(savedUser.getEmail());
            return businessRepository.save(b);
        }

        if ("DRIVER".equalsIgnoreCase(user.getRole())) {
            Driver d = new Driver();
            d.setName(savedUser.getUsername());
            d.setEmail(savedUser.getEmail());
            return driverRepository.save(d);
        }

        Customer c = new Customer();
        c.setName(savedUser.getUsername());
        c.setEmail(savedUser.getEmail());
        return customerRepository.save(c);
    }

@PostMapping("/login")
public Map<String, Object> login(@RequestBody Map<String, String> req) {
    User user = userService.findByUsername(req.get("username"));
    if (user == null || !user.getPassword().equals(req.get("password"))) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Credentials");
    }
    String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
    Map<String, Object> response = new HashMap<>();
    response.put("token", token);          // ← real JWT now
    response.put("username", user.getUsername());
    response.put("email", user.getEmail());
    response.put("role", user.getRole());
    return response;
}

}