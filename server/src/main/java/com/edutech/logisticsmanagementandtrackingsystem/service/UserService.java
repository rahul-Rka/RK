package com.edutech.logisticsmanagementandtrackingsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.edutech.logisticsmanagementandtrackingsystem.entity.*;
import com.edutech.logisticsmanagementandtrackingsystem.entity.User;
import com.edutech.logisticsmanagementandtrackingsystem.repository.*;
import com.edutech.logisticsmanagementandtrackingsystem.jwt.JwtUtil;

import java.util.*;
import javax.transaction.Transactional;

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
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Username already exists"
            );
        }

        // ✅ BACKEND VALIDATION – DUPLICATE EMAIL
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Email already exists"
            );
        }

        // 🔐 Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // ✅ Save USER
        User savedUser = userRepository.save(user);

        // ✅ Save role‑specific entity
        switch (savedUser.getRole()) {

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
        }

        return savedUser;
    }

    /* =========================
       ✅ LOGIN USER
       ========================= */
    public Map<String, Object> loginUser(Map<String, String> req) {

        User user = Optional.ofNullable(
                userRepository.findByUsername(req.get("username")))
            .filter(u -> passwordEncoder.matches(req.get("password"), u.getPassword()))
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid Credentials"
                )
            );

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        return Map.of(
            "token", token,
            "id", user.getId(),
            "username", user.getUsername(),
            "email", user.getEmail(),
            "role", user.getRole()
        );
    }

    /* =========================
       ✅ SPRING SECURITY
       ========================= */
    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            List.of(new SimpleGrantedAuthority(user.getRole()))
        );
    }
}
