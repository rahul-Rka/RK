import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpService {

  serverName = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  // ===============================
  // AUTH
  // ===============================
  Login(data: any) {
    return this.http.post(
      `${this.serverName}/api/login`,
      data,
      this.getHeaders()
    );
  }

  registerUser(data: any) {
    return this.http.post(
      `${this.serverName}/api/register`,
      data,
      this.getHeaders()
    );
  }

  // ===============================
  // BUSINESS
  // ===============================
  getCargo() {
    return this.http.get(
      `${this.serverName}/api/business/cargo`,
      this.getHeaders()
    );
  }

  addCargo(data: any) {
    return this.http.post(
      `${this.serverName}/api/business/cargo`,
      data,
      this.getHeaders()
    );
  }

  // ✅ Available drivers (no location)
  getDrivers() {
    return this.http.get(
      `${this.serverName}/api/business/drivers`,
      this.getHeaders()
    );
  }

  // ✅ Available drivers filtered by location
  getDriversByLocation(location: string) {
    return this.http.get(
      `${this.serverName}/api/business/drivers?location=${encodeURIComponent(location)}`,
      this.getHeaders()
    );
  }

  getCustomers() {
    return this.http.get(
      `${this.serverName}/api/business/customers`,
      this.getHeaders()
    );
  }

  // ✅ IMPORTANT FIX: use '&' (NOT '&amp;') in TS
  assignCargo(cargoId: number, driverId: number, customerId: number) {
    return this.http.post(
      `${this.serverName}/api/business/assign-cargo?cargoId=${cargoId}&driverId=${driverId}&customerId=${customerId}`,
      {},
      this.getHeaders()
    );
  }

  // ===============================
  // DRIVER
  // ===============================
  getAssignOrders() {
    return this.http.get(
      `${this.serverName}/api/driver/cargo`,
      this.getHeaders()
    );
  }

  // ✅ IMPORTANT FIX: use '&' (NOT '&amp;') in TS
  updateCargoStatus(cargoId: number, newStatus: string) {
    return this.http.put(
      `${this.serverName}/api/driver/update-cargo-status?cargoId=${cargoId}&newStatus=${newStatus}`,
      {},
      this.getHeaders()
    );
  }

  toggleAvailability() {
    return this.http.post(
      `${this.serverName}/api/driver/availability/toggle`,
      {},
      this.getHeaders()
    );
  }

  updateDriverLocation(currentLocation: string) {
    return this.http.put(
      `${this.serverName}/api/driver/location`,
      { currentLocation },
      this.getHeaders()
    );
  }

  // ===============================
  // CUSTOMER
  // ===============================
  getCustomerCargos() {
    return this.http.get(
      `${this.serverName}/api/customer/cargo`,
      this.getHeaders()
    );
  }
}