import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpService {

  serverName = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /* ===============================
     HEADERS
     =============================== */

  // Public endpoints (login/register/reset) - NO token
  private jsonHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  // Protected endpoints - attach token only if exists
  private authHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      })
    };
  }

  /* ===============================
     AUTH (PUBLIC)
     =============================== */

  Login(data: any) {
    return this.http.post(
      `${this.serverName}/api/login`,
      data,
      this.jsonHeaders()
    );
  }

  registerUser(data: any) {
    return this.http.post(
      `${this.serverName}/api/register`,
      data,
      this.jsonHeaders()
    );
  }

  // Reset Password (email-based)
  resetPassword(data: any) {
    return this.http.post(
      `${this.serverName}/api/reset-password`,
      data,
      { ...this.jsonHeaders(), responseType: 'text' as 'json' }
    );
  }

  /* ===============================
     BUSINESS (PROTECTED)
     =============================== */

  getCargo() {
    return this.http.get(
      `${this.serverName}/api/business/cargo`,
      this.authHeaders()
    );
  }

  addCargo(data: any) {
    return this.http.post(
      `${this.serverName}/api/business/cargo`,
      data,
      this.authHeaders()
    );
  }

  getDrivers() {
    return this.http.get(
      `${this.serverName}/api/business/drivers`,
      this.authHeaders()
    );
  }

  getCustomers() {
    return this.http.get(
      `${this.serverName}/api/business/customers`,
      this.authHeaders()
    );
  }

  assignCargo(cargoId: number, driverId: number, customerId: number) {
    return this.http.post(
      `${this.serverName}/api/business/assign-cargo?cargoId=${cargoId}&driverId=${driverId}&customerId=${customerId}`,
      {},
      this.authHeaders()
    );
  }

  /**
   * ✅ MISSING METHOD #1 (Your Assign Cargo screen calls this)
   * Returns drivers filtered by location.
   *
   * IMPORTANT: Endpoint must exist in backend.
   * If your backend uses a different URL, tell me the mapping and I will adjust.
   */
  getDriversByLocation(location: string) {
    return this.http.get(
      `${this.serverName}/api/business/drivers-by-location?location=${encodeURIComponent(location)}`,
      this.authHeaders()
    );
  }

  /* ===============================
     DRIVER (PROTECTED)
     =============================== */

  getAssignOrders() {
    return this.http.get(
      `${this.serverName}/api/driver/cargo`,
      this.authHeaders()
    );
  }

  updateCargoStatus(cargoId: number, newStatus: string) {
    return this.http.put(
      `${this.serverName}/api/driver/update-cargo-status?cargoId=${cargoId}&newStatus=${encodeURIComponent(newStatus)}`,
      {},
      this.authHeaders()
    );
  }

  /**
   * ✅ MISSING METHOD #2 (Dashboard calls this)
   * Toggle driver availability (AVAILABLE / UNAVAILABLE)
   *
   * IMPORTANT: Endpoint must exist in backend.
   */
  toggleAvailability() {
    return this.http.put(
      `${this.serverName}/api/driver/toggle-availability`,
      {},
      this.authHeaders()
    );
  }

  /**
   * ✅ MISSING METHOD #3 (Dashboard calls this)
   * Update driver location
   *
   * IMPORTANT: Endpoint must exist in backend.
   */
  updateDriverLocation(location: string) {
    return this.http.put(
      `${this.serverName}/api/driver/update-location?location=${encodeURIComponent(location)}`,
      {},
      this.authHeaders()
    );
  }

  /* ===============================
     CUSTOMER (PROTECTED)
     =============================== */

  getCustomerCargos() {
    return this.http.get(
      `${this.serverName}/api/customer/cargo`,
      this.authHeaders()
    );
  }
}