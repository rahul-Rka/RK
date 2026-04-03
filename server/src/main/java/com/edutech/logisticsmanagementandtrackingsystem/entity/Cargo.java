package com.edutech.logisticsmanagementandtrackingsystem.entity;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Cargo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
    private String size;

    // ✅ NEW: location used for driver filtering (pickup/source)
    @Column(name = "source_location")
    private String sourceLocation;

    // Status can be: PENDING, IN_TRANSIT, DELIVERED
    private String status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "business_id")
    @JsonIgnore
    private Business business;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    public Cargo() {
        this.status = "PENDING";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getSourceLocation() { return sourceLocation; }
    public void setSourceLocation(String sourceLocation) { this.sourceLocation = sourceLocation; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Business getBusiness() { return business; }
    public void setBusiness(Business business) { this.business = business; }

    public Driver getDriver() { return driver; }
    public void setDriver(Driver driver) { this.driver = driver; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }
}