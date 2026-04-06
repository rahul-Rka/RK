import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
 
@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {
 
  role = '';
  cargos: any[] = [];
  drivers: any[] = [];
  assignedCargos: any[] = [];
 
  driverAvailable: boolean | null = null;
  locationInput = '';
 
  showDriverDetails = false;
 
  constructor(
    private authService: AuthService,
    private service: HttpService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    this.role = this.authService.getRole;
 
    // BUSINESS
    if (this.role === 'BUSINESS') {
      this.service.getCargo().subscribe({
        next: (res: any) => this.cargos = Array.isArray(res) ? res : [],
        error: (err: any) => console.error('getCargo error', err)
      });
 
      this.service.getDrivers().subscribe({
        next: (res: any) => this.drivers = Array.isArray(res) ? res : [],
        error: (err: any) => console.error('getDrivers error', err)
      });
    }
 
    // DRIVER
    if (this.role === 'DRIVER') {
 
      this.service.getAssignOrders().subscribe({
        next: (res: any) => this.assignedCargos = Array.isArray(res) ? res : [],
        error: (err: any) => console.error('getAssignOrders error', err)
      });
 
      //  This is the key fix: load saved availability + location after login
      this.service.getDriverProfile().subscribe({
        next: (driver: any) => {
          this.driverAvailable = driver?.available ?? null;
          this.locationInput = driver?.currentLocation || '';
        },
        error: (err: any) => {
          console.error('getDriverProfile error', err);
          this.driverAvailable = null;
          this.locationInput = '';
        }
      });
    }
  }
 
  toggleDriverInfo() {
    this.showDriverDetails = !this.showDriverDetails;
  }
 
  toggleAvailability() {
    this.service.toggleAvailability().subscribe({
      next: (d: any) => this.driverAvailable = d?.available ?? this.driverAvailable,
      error: (err: any) => console.error('toggleAvailability error', err)
    });
  }
 
  saveLocation() {
    if (!this.locationInput || this.locationInput.trim().length === 0) return;
 
    this.service.updateDriverLocation(this.locationInput.trim()).subscribe({
      next: () => {},
      error: (err: any) => console.error('updateDriverLocation error', err)
    });
  }
 
  goToViewCargo() {
    this.router.navigate(['/view-cargo-status']);
  }
}
 