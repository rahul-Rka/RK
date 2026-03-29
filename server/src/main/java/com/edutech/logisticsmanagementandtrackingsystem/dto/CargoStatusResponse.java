package com.edutech.logisticsmanagementandtrackingsystem.dto;

public class CargoStatusResponse {

    private Long cargoId;
    private String content;
    private String size;
    private String status;

    public CargoStatusResponse() {}

    public CargoStatusResponse(Long cargoId, String content, String size, String status) {
        this.cargoId = cargoId;
        this.content = content;
        this.size = size;
        this.status = status;
    }

    public Long getCargoId() { return cargoId; }
    public String getContent() { return content; }
    public String getSize() { return size; }
    public String getStatus() { return status; }
}