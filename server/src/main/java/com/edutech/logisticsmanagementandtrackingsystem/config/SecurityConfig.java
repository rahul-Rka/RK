package com.edutech.logisticsmanagementandtrackingsystem.config;
 
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
 
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;

import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
 
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
 
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.password.PasswordEncoder;
 
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
 
import com.edutech.logisticsmanagementandtrackingsystem.jwt.JwtRequestFilter;

import com.edutech.logisticsmanagementandtrackingsystem.service.UserService;
 
@Configuration

@EnableWebSecurity

@EnableGlobalMethodSecurity(prePostEnabled = true)

public class SecurityConfig extends WebSecurityConfigurerAdapter {
 
    @Autowired

    private JwtRequestFilter jwtRequestFilter;
 
    @Autowired

    private UserService userService;
 
    // ✅ Use existing PasswordEncoder bean from Configurations.class

    @Autowired

    private PasswordEncoder passwordEncoder;
 
    @Override

    protected void configure(HttpSecurity http) throws Exception {
 
        http.cors().and()

            .csrf().disable()
 
            .authorizeRequests()
 
            // ✅ allow preflight requests

            .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
 
            // ✅ public endpoints

            .antMatchers("/api/register", "/api/login", "/api/reset-password").permitAll()
 
            // ✅ everything else requires token

            .anyRequest().authenticated()
 
            .and()

            .sessionManagement()

            .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
 
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

    }
 
    @Override

    protected void configure(AuthenticationManagerBuilder auth) throws Exception {

        auth.userDetailsService(userService)

            .passwordEncoder(passwordEncoder);

    }

}
 