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
import java.util.function.Function;

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

    // ✅ Save user with encoded password
    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // ✅ Find user by username
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // ✅ REGISTER — STREAM + FUNCTION MAPPING (NO IF)
    public User registerUser(User user) {

        // String role = user.getRole();

        // switch (role) {
        // case "BUSINESS":
        // Business b = new Business();
        // b.setName(user.getUsername());
        // b.setEmail(user.getEmail());
        // businessRepository.save(b);
        // break;
        // case "DRIVER":
        // Driver d = new Driver();
        // d.setName(user.getUsername());
        // d.setEmail(user.getEmail());
        // driverRepository.save(d);
        // break;
        // case "CUSTOMER":
        // Customer customer = new Customer();
        // customer.setEmail(user.getEmail());
        // customer.setName(user.getUsername());
        // break;
        // default:
        // break;
        // }

        // return register(user);

        Map<String, Function<User, Object>> roleHandlers = Map.of(
                "BUSINESS", u -> {
                    Business b = new Business();
                    b.setName(u.getUsername());
                    b.setEmail(u.getEmail());
                    return businessRepository.save(b);
                },
                "DRIVER", u -> {
                    Driver d = new Driver();
                    d.setName(u.getUsername());
                    d.setEmail(u.getEmail());
                    return driverRepository.save(d);
                });

        roleHandlers.entrySet().stream()
                .filter(e -> e.getKey().equalsIgnoreCase(user.getRole()))
                .findFirst()
                .map(e -> e.getValue().apply(user))
                .orElseGet(() -> {
                    Customer c = new Customer();
                    c.setName(user.getUsername());
                    c.setEmail(user.getEmail());
                    return customerRepository.save(c);
                });
        return register(user);
    }

    // ✅ LOGIN — PASSWORD CHECK USING BCrypt (NO IF)
    public Map<String, Object> loginUser(Map<String, String> req) {

        User user = Optional.ofNullable(userRepository.findByUsername(req.get("username")))
                .filter(u -> passwordEncoder.matches(req.get("password"), u.getPassword()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Credentials"));

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        return Map.of(
                "token", token,
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole());
    }

    // ✅ Required by Spring Security
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
                List.of(new SimpleGrantedAuthority(user.getRole())));
    }
}