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

  // ✅ Forgot Password / Reset Password (email-based)
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

  /**
   * ✅ MERGED:
   * Backend supports optional query param:
   * GET /api/business/drivers?location=...
   */
  getDrivers(location?: string) {
    const url = location && location.trim().length > 0
      ? `${this.serverName}/api/business/drivers?location=${encodeURIComponent(location.trim())}`
      : `${this.serverName}/api/business/drivers`;

    return this.http.get(url, this.authHeaders());
  }

  /**
   * ✅ Backward-compatible method used in your component:
   * Now maps to backend route /api/business/drivers?location=...
   */
  getDriversByLocation(location: string) {
    return this.getDrivers(location);
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

  // ✅ BUSINESS: feedback list and summary (from friend)
  getAllFeedbacks() {
    return this.http.get(
      `${this.serverName}/api/business/feedbacks`,
      this.authHeaders()
    );
  }

  getFeedbackSummary() {
    return this.http.get(
      `${this.serverName}/api/business/feedback-summary`,
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

  // ✅ Existing methods you needed earlier (kept)
  toggleAvailability() {
    return this.http.put(
      `${this.serverName}/api/driver/toggle-availability`,
      {},
      this.authHeaders()
    );
  }

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

  // ✅ CUSTOMER: submit feedback (stored in Cargo table)
  submitFeedback(cargoId: number, rating: number, comment: string) {
    return this.http.post(
      `${this.serverName}/api/customer/submit-feedback?cargoId=${cargoId}`,
      { rating, comment },
      this.authHeaders()
    );
  }
}