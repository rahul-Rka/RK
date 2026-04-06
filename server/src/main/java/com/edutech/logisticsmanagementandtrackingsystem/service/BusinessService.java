package com.edutech.logisticsmanagementandtrackingsystem.service;

import com.edutech.logisticsmanagementandtrackingsystem.entity.Cargo;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Customer;
import com.edutech.logisticsmanagementandtrackingsystem.entity.Driver;
import com.edutech.logisticsmanagementandtrackingsystem.repository.CargoRepository;
import com.edutech.logisticsmanagementandtrackingsystem.repository.CustomerRepository;
import com.edutech.logisticsmanagementandtrackingsystem.repository.DriverRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.Comparator;

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

        if (cargo.getStatus() == null || cargo.getStatus().trim().isEmpty()) {
            cargo.setStatus("PENDING");
        }

        // ✅ Set default EDD if missing (safe)
        if (cargo.getEstimatedDeliveryDate() == null) {
            cargo.setEstimatedDeliveryDate(LocalDate.now().plusDays(3));
        }

        return cargoRepository.save(cargo);
    }

    /*  GET ALL CARGOS */
    public List<Cargo> getAllCargo() {
        return cargoRepository.findAll();
    }

    /* EXISTING METHOD */
    public Cargo assignCargoToDriver(Long cargoId, Long driverId) {

        Cargo cargo = cargoRepository.findById(cargoId).orElse(null);
        Driver driver = driverRepository.findById(driverId).orElse(null);

        if (cargo != null && driver != null) {
            cargo.setDriver(driver);
            cargo.setStatus("IN_TRANSIT");

            // ✅ Safe EDD fallback
            if (cargo.getEstimatedDeliveryDate() == null) {
                cargo.setEstimatedDeliveryDate(LocalDate.now().plusDays(3));
            }

            return cargoRepository.save(cargo);
        }

        return null;
    }

    /* ✅ ASSIGN DRIVER + CUSTOMER */
    @Transactional
    public Cargo assignCargoToDriverAndCustomer(Long cargoId, Long driverId, Long customerId) {

        Cargo cargo = cargoRepository.findById(cargoId)
                .orElseThrow(() -> new RuntimeException("Cargo not found"));

        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        cargo.setDriver(driver);
        cargo.setCustomer(customer);
        cargo.setStatus("IN_TRANSIT");

        // ✅ Safe EDD fallback
        if (cargo.getEstimatedDeliveryDate() == null) {
            cargo.setEstimatedDeliveryDate(LocalDate.now().plusDays(3));
        }

        return cargoRepository.save(cargo);
    }

    /* ✅ BUSINESS: VIEW ALL FEEDBACK CARGOS */
    public List<Cargo> getAllFeedbackCargos() {
        return cargoRepository.getFeedbackCargos();
    }

    /* ✅ BUSINESS: FEEDBACK SUMMARY */
    public Map<String, Object> getFeedbackSummary() {

        List<Cargo> feedbackCargos = cargoRepository.getFeedbackCargos();

        double overallAverage = feedbackCargos.stream()
                .map(Cargo::getFeedbackRating)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);

        long totalCount = feedbackCargos.stream()
                .map(Cargo::getFeedbackRating)
                .filter(Objects::nonNull)
                .count();

        List<DriverStats> stats = feedbackCargos.stream()
                .filter(c -> c.getDriver() != null && c.getFeedbackRating() != null)
                .collect(Collectors.groupingBy(c -> c.getDriver().getId()))
                .entrySet()
                .stream()
                .map(entry -> {
                    Long driverId = entry.getKey();
                    List<Cargo> list = entry.getValue();

                    double avg = list.stream()
                            .map(Cargo::getFeedbackRating)
                            .filter(Objects::nonNull)
                            .mapToInt(Integer::intValue)
                            .average()
                            .orElse(0.0);

                    long count = list.stream()
                            .map(Cargo::getFeedbackRating)
                            .filter(Objects::nonNull)
                            .count();

                    String driverName = list.stream()
                            .map(Cargo::getDriver)
                            .filter(Objects::nonNull)
                            .map(Driver::getName)
                            .findFirst()
                            .orElse("Unknown");

                    return new DriverStats(driverId, driverName, avg, count);
                })
                .sorted(Comparator.comparingDouble(DriverStats::getAverageRating).reversed())
                .collect(Collectors.toList());

        List<Map<String, Object>> perDriver = stats.stream()
                .map(s -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("driverId", s.getDriverId());
                    row.put("driverName", s.getDriverName());
                    row.put("averageRating", s.getAverageRating());
                    row.put("feedbackCount", s.getFeedbackCount());
                    return row;
                })
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("overallAverageRating", overallAverage);
        result.put("totalFeedbackCount", totalCount);
        result.put("perDriver", perDriver);
        return result;
    }

    private static class DriverStats {
        private final Long driverId;
        private final String driverName;
        private final double averageRating;
        private final long feedbackCount;

        private DriverStats(Long driverId, String driverName, double averageRating, long feedbackCount) {
            this.driverId = driverId;
            this.driverName = driverName;
            this.averageRating = averageRating;
            this.feedbackCount = feedbackCount;
        }

        public Long getDriverId() { return driverId; }
        public String getDriverName() { return driverName; }
        public double getAverageRating() { return averageRating; }
        public long getFeedbackCount() { return feedbackCount; }
    }
}