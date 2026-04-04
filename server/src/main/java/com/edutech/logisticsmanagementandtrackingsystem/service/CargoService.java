package com.edutech.logisticsmanagementandtrackingsystem.service;

import java.time.LocalDate;
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

        if (cargo.getStatus() == null || cargo.getStatus().trim().isEmpty()) {
            cargo.setStatus("PENDING");
        }

        // ✅ Set default EDD only if not provided
        if (cargo.getEstimatedDeliveryDate() == null) {
            cargo.setEstimatedDeliveryDate(LocalDate.now().plusDays(3));
        }

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
    public Cargo updateStatusForDriver(Long cargoId, String newStatus, String username) {

        Cargo cargo = cargoRepository.findById(cargoId)
                .orElseThrow(() -> new RuntimeException("Cargo not found"));

        if (cargo.getDriver() == null || !cargo.getDriver().getName().equals(username)) {
            throw new RuntimeException("Unauthorized cargo update");
        }

        // ✅ validate allowed statuses
        String normalized = (newStatus == null) ? "" : newStatus.trim().toUpperCase();
        if (!normalized.equals("PENDING") && !normalized.equals("IN_TRANSIT") && !normalized.equals("DELIVERED")) {
            throw new RuntimeException("Invalid status");
        }

        cargo.setStatus(normalized);

        // ✅ Safe fallback EDD if missing
        if (cargo.getEstimatedDeliveryDate() == null) {
            cargo.setEstimatedDeliveryDate(LocalDate.now().plusDays(3));
        }

        return cargoRepository.save(cargo);
    }

    /* ✅ GET CARGO BY ID (SAFE) */
    public Cargo getCargoById(Long cargoId) {
        return cargoRepository.findById(cargoId).orElse(null);
    }

    /* ✅ SAVE CARGO (Used during assign/update flows if needed) */
    public Cargo saveCargo(Cargo cargo) {

        if (cargo.getStatus() == null || cargo.getStatus().trim().isEmpty()) {
            cargo.setStatus("PENDING");
        }

        if (cargo.getEstimatedDeliveryDate() == null) {
            cargo.setEstimatedDeliveryDate(LocalDate.now().plusDays(3));
        }

        return cargoRepository.save(cargo);
    }
}