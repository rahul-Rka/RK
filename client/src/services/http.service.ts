import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpService {

  serverName = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /* ===== COMMON HEADERS ===== */
  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  /* ===== AUTH ===== */
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

  /* ===== BUSINESS ===== */

  // Get all cargos
  getCargo() {
    return this.http.get(
      `${this.serverName}/api/business/cargo`,
      this.getHeaders()
    );
  }

  // Add new cargo
  addCargo(data: any) {
    return this.http.post(
      `${this.serverName}/api/business/cargo`,
      data,
      this.getHeaders()
    );
  }

  // Get all drivers
  getDrivers() {
    return this.http.get(
      `${this.serverName}/api/business/drivers`,
      this.getHeaders()
    );
  }

  // ✅ Get all customers
  getCustomers() {
    return this.http.get(
      `${this.serverName}/api/business/customers`,
      this.getHeaders()
    );
  }

  // ✅ Assign cargo to driver + customer
  assignCargo(cargoId: number, driverId: number, customerId: number) {
    return this.http.post(
      `${this.serverName}/api/business/assign-cargo?cargoId=${cargoId}&driverId=${driverId}&customerId=${customerId}`,
      {},
      this.getHeaders()
    );
  }

  /* ===== DRIVER ===== */

  // Driver dashboard
  getAssignOrders() {
    return this.http.get(
      `${this.serverName}/api/driver/cargo`,
      this.getHeaders()
    );
  }

  // Driver updates status (own cargo only)
  updateCargoStatus(cargoId: number, newStatus: string) {
    return this.http.put(
      `${this.serverName}/api/driver/update-cargo-status?cargoId=${cargoId}&newStatus=${newStatus}`,
      {},
      this.getHeaders()
    );
  }

  /* ===== CUSTOMER ===== */

  // ✅ Customer dashboard (own cargos only)
  getCustomerCargos() {
    return this.http.get(
      `${this.serverName}/api/customer/cargo`,
      this.getHeaders()
    );
  }
}