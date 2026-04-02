import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-assgin-cargo',
  templateUrl: './assgin-cargo.component.html'
})
export class AssginCargoComponent implements OnInit {

  cargos: any[] = [];
  drivers: any[] = [];
  customers: any[] = [];          // ✅ NEW
  assignedCargos: any[] = [];

  selectedCargoId: number | null = null;
  selectedDriverId: number | null = null;
  selectedCustomerId: number | null = null; // ✅ NEW

  successMessage = '';
  errorMessage = '';
  role = '';

  constructor(private service: HttpService, private router: Router) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';

    if (this.role === 'BUSINESS') {

      this.service.getCargo().subscribe(data => {
        this.cargos = data as any[];
      });

      this.service.getDrivers().subscribe(data => {
        this.drivers = data as any[];
      });

      // ✅ LOAD CUSTOMERS
      this.service.getCustomers().subscribe(data => {
        this.customers = data as any[];
      });
    }

    if (this.role === 'DRIVER') {
      this.service.getAssignOrders().subscribe(data => {
        this.assignedCargos = data as any[];
      });
    }
  }

  assign(): void {
    if (this.selectedCargoId && this.selectedDriverId && this.selectedCustomerId) {

      this.service.assignCargo(
        this.selectedCargoId,
        this.selectedDriverId,
        this.selectedCustomerId
      ).subscribe({
        next: () => {
          this.successMessage = 'Cargo assigned successfully!';
          this.errorMessage = '';

          this.selectedCargoId = null;
          this.selectedDriverId = null;
          this.selectedCustomerId = null;
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