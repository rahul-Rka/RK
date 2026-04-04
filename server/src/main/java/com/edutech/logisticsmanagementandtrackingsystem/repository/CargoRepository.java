package com.edutech.logisticsmanagementandtrackingsystem.repository;

import com.edutech.logisticsmanagementandtrackingsystem.entity.Cargo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CargoRepository extends JpaRepository<Cargo, Long> {

    List<Cargo> findByDriver_Id(Long driverId);

    List<Cargo> findByCustomer_Id(Long customerId);

    // ✅ Portal-safe JPQL: cargos having feedback
    @Query("SELECT c FROM Cargo c WHERE c.feedbackRating IS NOT NULL")
    List<Cargo> getFeedbackCargos();
}