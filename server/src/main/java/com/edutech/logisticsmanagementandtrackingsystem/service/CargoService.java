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
        cargo.setStatus("PENDING");
        return cargoRepository.save(cargo);
    }

    /* ✅ VIEW ALL CARGOS */
    public List<Cargo> getAllCargo() {
        return cargoRepository.findAll();
    }

    /* ✅ VIEW CARGOS ASSIGNED TO DRIVER */
    
public List<Cargo> getCargosForLoggedInDriver(String username) {

    Driver driver = driverRepository.findByName(username);

    if (driver == null) {
        return List.of();
    }

    return cargoRepository.findByDriver_Id(driver.getId());
}

    /* ✅ UPDATE STATUS USING STREAM */
    public Cargo updateStatus(Long cargoId, String newStatus) {

        return cargoRepository.findAll()
                .stream()
                .filter(c -> c.getId().equals(cargoId))
                .findFirst()
                .map(c -> {
                    c.setStatus(newStatus);
                    return cargoRepository.save(c);
                })
                .orElse(null);
    }

    /* ✅ ASSIGN DRIVER USING STREAM */
    public Cargo assignCargoToDriver(Long cargoId, Long driverId) {

        Cargo cargo = cargoRepository.findAll()
                .stream()
                .filter(c -> c.getId().equals(cargoId))
                .findFirst()
                .orElse(null);

        Driver driver = driverRepository.findAll()
                .stream()
                .filter(d -> d.getId().equals(driverId))
                .findFirst()
                .orElse(null);

        return java.util.stream.Stream.of(cargo)
                .filter(c -> c != null && driver != null)
                .findFirst()
                .map(c -> {
                    c.setDriver(driver);
                    c.setStatus("IN_TRANSIT"); // better than ASSIGNED
                    return cargoRepository.save(c);
                })
                .orElse(null);
    }

    /* ✅ GET CARGO BY ID USING STREAM */
    public Cargo getCargoById(Long cargoId) {

        return cargoRepository.findAll()
                .stream()
                .filter(c -> c.getId().equals(cargoId))
                .findFirst()
                .orElse(null);
    }
}