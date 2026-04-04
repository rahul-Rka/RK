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

  // ⭐ NEW → show details only when user clicks on "Total Drivers"
  showDriverDetails = false;

  constructor(
    private authService: AuthService,
    private service: HttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole;

    if (this.role === 'BUSINESS') {
      this.service.getCargo().subscribe((res: any) => this.cargos = res);

      // fetching drivers -> includes availability + location
      this.service.getDrivers().subscribe((res: any) => {
        this.drivers = res;
      });
    }

    if (this.role === 'DRIVER') {
      this.service.getAssignOrders().subscribe((res: any) => this.assignedCargos = res);
    }
  }

  // ⭐ NEW → toggle driver details
  toggleDriverInfo() {
    this.showDriverDetails = !this.showDriverDetails;
  }

  toggleAvailability() {
    this.service.toggleAvailability().subscribe({
      next: (d: any) => this.driverAvailable = d.available,
      error: (err: any) => console.error(err)
    });
  }

  saveLocation() {
    if (!this.locationInput) return;
    this.service.updateDriverLocation(this.locationInput).subscribe({
      next: () => {},
      error: (err: any) => console.error(err)
    });
  }

  goToViewCargo() {
    this.router.navigate(['/view-cargo-status']);
  }
}