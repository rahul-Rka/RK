package com.edutech.logisticsmanagementandtrackingsystem.service;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.logisticsmanagementandtrackingsystem.entity.Cargo;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Customer;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Driver;
import com.edutech.logisticsmanagementandtrackingsystem.repository.CargoRepository;
import com.edutech.logisticsmanagementandtrackingsystem.repository.CustomerRepository;
import com.edutech.logisticsmanagementandtrackingsystem.repository.DriverRepository;

@Service
public class BusinessService {

    @Autowired
    private CargoRepository cargoRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private CustomerRepository customerRepository;

    /* ✅ ADD CARGO */
    public Cargo addCargo(Cargo cargo) {
        cargo.setStatus("PENDING");
        return cargoRepository.save(cargo);
    }

    /* ✅ GET ALL CARGOS */
    public List<Cargo> getAllCargo() {
        return cargoRepository.findAll();
    }

    /* ✅ EXISTING METHOD (UNCHANGED) */
    public Cargo assignCargoToDriver(Long cargoId, Long driverId) {

        Cargo cargo = cargoRepository.findById(cargoId).orElse(null);
        Driver driver = driverRepository.findById(driverId).orElse(null);

        if (cargo != null && driver != null) {
            cargo.setDriver(driver);
            cargo.setStatus("IN_TRANSIT");
            return cargoRepository.save(cargo);
        }

        return null;
    }

    /* ✅ NEW METHOD: ASSIGN DRIVER + CUSTOMER */
    @Transactional
    public Cargo assignCargoToDriverAndCustomer(
            Long cargoId,
            Long driverId,
            Long customerId) {

        Cargo cargo = cargoRepository.findById(cargoId)
                .orElseThrow(() -> new RuntimeException("Cargo not found"));

        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        cargo.setDriver(driver);
        cargo.setCustomer(customer);
        cargo.setStatus("IN_TRANSIT");

        return cargoRepository.save(cargo);
    }
}