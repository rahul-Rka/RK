package com.edutech.logisticsmanagementandtrackingsystem.jwt;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.edutech.logisticsmanagementandtrackingsystem.entity.User;
import com.edutech.logisticsmanagementandtrackingsystem.repository.UserRepository;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;



/* =========================================================
   File: src/main/java/.../jwt/JwtUtil.java
   ========================================================= */
import io.jsonwebtoken.*;
import java.util.Date;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private final String SECRET = "logistics_secret";

    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(SignatureAlgorithm.HS512, SECRET)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
