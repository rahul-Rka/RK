package com.edutech.logisticsmanagementandtrackingsystem.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.logisticsmanagementandtrackingsystem.entity.Cargo;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Driver;
import com.edutech.logisticsmanagementandtrackingsystem.repository.CargoRepository;
import com.edutech.logisticsmanagementandtrackingsystem.repository.DriverRepository;

@Service
public class BusinessService {

    @Autowired
    private CargoRepository cargoRepository;

    @Autowired
    private DriverRepository driverRepository;


    public Cargo addCargo(Cargo cargo) {
        cargo.setStatus("PENDING");
        return cargoRepository.save(cargo);
    }

    /* ✅ GET ALL CARGOS */
    public List<Cargo> getAllCargo() {
        return cargoRepository.findAll();
    }

    /* ✅ ASSIGN CARGO */
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

        if (cargo != null && driver != null) {
            cargo.setDriver(driver);
            cargo.setStatus("IN_TRANSIT");
            return cargoRepository.save(cargo);
        }

        return null;
    }
}