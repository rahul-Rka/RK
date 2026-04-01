

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class HttpService {

  serverName = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        // 'Authorization': `Bearer mockToken`
      })
    };
  }

  getOrderStatus(cargoId: number) {
    return this.http.get(
      `${this.serverName}/api/customer/cargo-status?cargoId=${cargoId}`,
      this.getHeaders()
    );
  }

  updateCargoStatus(newStatus: string, cargoId: number) {
    return this.http.put(
      `${this.serverName}/api/driver/update-cargo-status?cargoId=${cargoId}&newStatus=${newStatus}`,
      {},
      this.getHeaders()
    );
  }

  assignDriver(driverId: number, cargoId: number) {
    return this.http.post(
      `${this.serverName}/api/business/assign-cargo?cargoId=${cargoId}&driverId=${driverId}`,
      {},
      this.getHeaders()
    );
  }

  // getAssignOrders(driverId: number) {
  //   return this.http.get(
  //     `${this.serverName}/api/driver/cargo?driverId=${driverId}`,
  //     this.getHeaders()
  //   );
  // }

  getCargo() {
    return this.http.get(
      `${this.serverName}/api/business/cargo`,
      this.getHeaders()
    );
  }

  getDrivers() {
    return this.http.get(
      `${this.serverName}/api/business/drivers`,
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
  
getAssignOrders() {
  return this.http.get(
    `${this.serverName}/api/driver/cargo`,
    this.getHeaders()
  );
}

}