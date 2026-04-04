package com.edutech.logisticsmanagementandtrackingsystem.service;

import com.edutech.logisticsmanagementandtrackingsystem.entity.Business;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Customer;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Driver;
import com.edutech.logisticsmanagementandtrackingsystem.entity.User;
import com.edutech.logisticsmanagementandtrackingsystem.jwt.JwtUtil;
import com.edutech.logisticsmanagementandtrackingsystem.repository.BusinessRepository;
import com.edutech.logisticsmanagementandtrackingsystem.repository.CustomerRepository;
import com.edutech.logisticsmanagementandtrackingsystem.repository.DriverRepository;
import com.edutech.logisticsmanagementandtrackingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /* =========================
       ✅ REGISTER USER
       ========================= */
    @Transactional
    public User registerUser(User user) {

        // ✅ BACKEND VALIDATION – DUPLICATE USERNAME
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists");
        }

        // ✅ BACKEND VALIDATION – DUPLICATE EMAIL
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        // 🔐 Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // ✅ Save USER
        User savedUser = userRepository.save(user);

        // ✅ Save role‑specific entity
        String role = savedUser.getRole() == null ? "" : savedUser.getRole().toUpperCase();

        switch (role) {
            case "DRIVER":
                Driver driver = new Driver();
                driver.setName(savedUser.getUsername());
                driver.setEmail(savedUser.getEmail());
                driverRepository.save(driver);
                break;

            case "BUSINESS":
                Business business = new Business();
                business.setName(savedUser.getUsername());
                business.setEmail(savedUser.getEmail());
                businessRepository.save(business);
                break;

            case "CUSTOMER":
                Customer customer = new Customer();
                customer.setName(savedUser.getUsername());
                customer.setEmail(savedUser.getEmail());
                customerRepository.save(customer);
                break;

            default:
                // If some other role comes, just ignore role-specific table
                break;
        }

        return savedUser;
    }

    /* =========================
       ✅ LOGIN USER
       ========================= */
    public Map<String, Object> loginUser(Map<String, String> req) {

        User user = Optional.ofNullable(userRepository.findByUsername(req.get("username")))
                .filter(u -> passwordEncoder.matches(req.get("password"), u.getPassword()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Credentials"));

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        Map<String, Object> resp = new HashMap<>();
        resp.put("token", token);
        resp.put("id", user.getId());
        resp.put("username", user.getUsername());
        resp.put("email", user.getEmail());
        resp.put("role", user.getRole());
        return resp;
    }

    /* =========================
       ✅ RESET PASSWORD (EMAIL-BASED)
       ========================= */
    @Transactional
    public void resetPassword(String email, String newPassword) {

        if (email == null || email.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }

        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password required");
        }

        // ✅ Use ignore-case search if your repo supports it
        User user = userRepository.findByEmailIgnoreCase(email);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /* =========================
       ✅ SPRING SECURITY
       ========================= */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        // ✅ Make authorities compatible with both styles:
        // - "DRIVER" (your current)
        // - "ROLE_DRIVER" (Spring recommended)
        String role = user.getRole() == null ? "USER" : user.getRole().toUpperCase();

        List<SimpleGrantedAuthority> authorities = Arrays.asList(
                new SimpleGrantedAuthority(role),
                new SimpleGrantedAuthority("ROLE_" + role)
        );

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                authorities
        );
    }
}