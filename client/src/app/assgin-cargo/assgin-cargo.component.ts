import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-assgin-cargo',
  templateUrl: './assgin-cargo.component.html'
})
export class AssginCargoComponent implements OnInit {

  cargos: any[]        = [];
  drivers: any[]       = [];
  assignedCargos: any[] = [];

  selectedCargoId: any  = null;
  selectedDriverId: any = null;

  successMessage = '';
  errorMessage   = '';
  role = '';

  constructor(private service: HttpService, private router: Router) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';

    if (this.role === 'BUSINESS') {
      this.service.getCargo().subscribe({
        next: (data: any) => this.cargos = data,
        error: () => {}
      });
      this.service.getDrivers().subscribe({
        next: (data: any) => 
          {
            this.drivers = data
            console.log(this.drivers);

          }
        
        // error: () => {}
      });

     
    }

  
if (this.role === 'DRIVER') {
  this.service.getAssignOrders().subscribe({
    next: (data: any) => this.assignedCargos = data,
    error: () => {}
  });
}

  }

  assign(): void {
    if (this.selectedDriverId && this.selectedCargoId) {
      this.service.assignDriver(
        Number(this.selectedDriverId),
        Number(this.selectedCargoId)
      ).subscribe({
        next: () => {
          this.successMessage = 'Cargo assigned successfully!';
          this.errorMessage   = '';
          this.selectedCargoId  = null;
          this.selectedDriverId = null;
        },
        error: () => {
          this.errorMessage   = 'Failed to assign cargo. Please try again.';
          this.successMessage = '';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}