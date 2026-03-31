package com.edutech.logisticsmanagementandtrackingsystem.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.edutech.logisticsmanagementandtrackingsystem.entity.Cargo;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Driver;
import com.edutech.logisticsmanagementandtrackingsystem.repository.CargoRepository;
import com.edutech.logisticsmanagementandtrackingsystem.repository.DriverRepository;

@Service
public class CargoService {

    @Autowired
    private CargoRepository cargoRepository;

    @Autowired
    private DriverRepository driverRepository;

    /* ✅ ADD CARGO */
    public Cargo addCargo(Cargo cargo) {
        // ✅ tests expect default status
        cargo.setStatus("PENDING");
        return cargoRepository.save(cargo);
    }

    /* ✅ VIEW ALL CARGOS */
    public List<Cargo> getAllCargo() {
        return cargoRepository.findAll();
    }

    /* ✅ VIEW CARGOS ASSIGNED TO A DRIVER */
    public List<Cargo> getByDriver(Long driverId) {
        return cargoRepository.findByDriver_Id(driverId);
    }

    /* ✅ UPDATE CARGO STATUS (DRIVER) */
    public Cargo updateStatus(Long cargoId, String newStatus) {
        Cargo cargo = cargoRepository.findById(cargoId)
                .orElseThrow(() -> new RuntimeException("Cargo not found"));

        cargo.setStatus(newStatus);
        return cargoRepository.save(cargo);   
    }

   
    public Cargo assignCargoToDriver(Long cargoId, Long driverId) {

        Cargo cargo = cargoRepository.findById(cargoId)
                .orElseThrow(() -> new RuntimeException("Cargo not found"));

        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        cargo.setDriver(driver);
        cargo.setStatus("ASSIGNED");

        return cargoRepository.saveAndFlush(cargo); // ✅ ensures DB sync for tests
    }

    
    public Cargo getCargoById(Long cargoId) {
        return cargoRepository.findById(cargoId)
                .orElseThrow(() -> new RuntimeException("Cargo not found"));
    }
}