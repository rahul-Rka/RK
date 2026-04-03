import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-assgin-cargo',
  templateUrl: './assgin-cargo.component.html',
  styleUrls: ['./assgin-cargo.component.scss']
})
export class AssginCargoComponent implements OnInit {

  cargos: any[] = [];
  drivers: any[] = [];
  customers: any[] = [];

  selectedCargoId: number | null = null;
  selectedDriverId: number | null = null;
  selectedCustomerId: number | null = null;

  successMessage = '';
  errorMessage = '';
  role = '';

  selectedCargoLocation = '';

  constructor(private service: HttpService, private router: Router) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';

    if (this.role === 'BUSINESS') {
      this.service.getCargo().subscribe({
        next: (data: any) => this.cargos = data,
        error: () => this.cargos = []
      });

      // initial drivers list: available drivers (no location filter yet)
      this.service.getDrivers().subscribe({
        next: (data: any) => this.drivers = data,
        error: () => this.drivers = []
      });

      this.service.getCustomers().subscribe({
        next: (data: any) => this.customers = data,
        error: () => this.customers = []
      });
    }
  }

  // called when cargo dropdown changes
  onCargoChange(): void {
    const selectedCargo = this.cargos.find(c => c.id === this.selectedCargoId);

    // reset driver selection whenever cargo changes
    this.selectedDriverId = null;

    if (!selectedCargo) {
      this.selectedCargoLocation = '';
      // fallback: show all available drivers
      this.service.getDrivers().subscribe({
        next: (data: any) => this.drivers = data,
        error: () => this.drivers = []
      });
      return;
    }

    this.selectedCargoLocation = selectedCargo.sourceLocation || '';

    // If cargo has no location, show all available drivers
    if (!this.selectedCargoLocation) {
      this.service.getDrivers().subscribe({
        next: (data: any) => this.drivers = data,
        error: () => this.drivers = []
      });
      return;
    }

    // filter drivers by location
    this.service.getDriversByLocation(this.selectedCargoLocation).subscribe({
      next: (data: any) => this.drivers = data,
      error: () => this.drivers = []
    });
  }

  assign(): void {
    if (this.selectedCargoId && this.selectedDriverId && this.selectedCustomerId) {

      this.service.assignCargo(this.selectedCargoId, this.selectedDriverId, this.selectedCustomerId)
        .subscribe({
          next: () => {
            this.successMessage = 'Cargo assigned successfully!';
            this.errorMessage = '';

            setTimeout(() => this.router.navigate(['/dashboard']), 1200);
          },
          error: () => {
            this.errorMessage = 'Failed to assign cargo.';
            this.successMessage = '';
          }
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}