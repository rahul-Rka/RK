package com.edutech.logisticsmanagementandtrackingsystem.jwt;

/* =========================================================
   File: JwtRequestFilter.java
   ========================================================= */

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        // ✅ Do NOTHING – just pass the request
        chain.doFilter(request, response);
    }
}