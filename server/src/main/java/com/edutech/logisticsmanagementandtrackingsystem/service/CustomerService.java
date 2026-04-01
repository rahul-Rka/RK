package com.edutech.logisticsmanagementandtrackingsystem.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.logisticsmanagementandtrackingsystem.repository.CargoRepository;

@Service
public class CustomerService {

    @Autowired
    private CargoRepository cargoRepository;

    public Map<String, Object> getCargoStatus(Long cargoId) {

        return cargoRepository.findAll()
                .stream()
                .filter(c -> c.getId().equals(cargoId))
                .findFirst()
                .map(c -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("cargoId", c.getId());
                    response.put("status", c.getStatus());
                    return response;
                })
                .orElse(new HashMap<>());
    }
}