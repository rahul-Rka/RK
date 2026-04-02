package com.edutech.logisticsmanagementandtrackingsystem.service;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        cargo.setStatus("PENDING");
        return cargoRepository.save(cargo);
    }

    /* ✅ VIEW ALL CARGOS (BUSINESS) */
    public List<Cargo> getAllCargo() {
        return cargoRepository.findAll();
    }

    /* ✅ DRIVER DASHBOARD — ONLY OWN CARGOS */
    public List<Cargo> getCargosForLoggedInDriver(String username) {

        Driver driver = driverRepository.findByName(username);

        if (driver == null) {
            return List.of();
        }

        return cargoRepository.findByDriver_Id(driver.getId());
    }

    /* ✅ DRIVER UPDATES ONLY OWN CARGO */
    @Transactional
    public Cargo updateStatusForDriver(
            Long cargoId,
            String newStatus,
            String username) {

        Cargo cargo = cargoRepository.findById(cargoId)
                .orElseThrow(() -> new RuntimeException("Cargo not found"));

        if (cargo.getDriver() == null ||
            !cargo.getDriver().getName().equals(username)) {
            throw new RuntimeException("Unauthorized cargo update");
        }

        cargo.setStatus(newStatus);
        return cargoRepository.save(cargo);
    }

    /* ✅ GET CARGO BY ID (SAFE) */
    public Cargo getCargoById(Long cargoId) {
        return cargoRepository.findById(cargoId)
                .orElse(null);
    }
}