package com.edutech.logisticsmanagementandtrackingsystem.repository;

/* =========================================================
   File: CustomerRepository.java
   ========================================================= */

import org.springframework.data.jpa.repository.JpaRepository;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Customer;
import org.springframework.stereotype.Repository;
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
   Customer findByName(String name);
}