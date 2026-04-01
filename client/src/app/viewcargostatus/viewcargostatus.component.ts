import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-viewcargostatus',
  templateUrl: './viewcargostatus.component.html'
})
export class ViewcargostatusComponent implements OnInit {

  // Customer fields
  cargoIdInput: number = 0;
  cargoStatus: any     = null;

  // Driver fields
  updateCargoId: number = 0;
  newStatus             = '';
  successMessage        = '';
  errorMessage          = '';

  role = '';

  constructor(private service: HttpService, private router: Router) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
  }

  viewStatus(): void {
    if (this.cargoIdInput) {
      this.service.getOrderStatus(this.cargoIdInput).subscribe({
        next: (res: any) => {
          this.cargoStatus  = res;
          this.errorMessage = '';
        },
        error: () => {
          this.errorMessage = 'Cargo not found. Please check the ID.';
          this.cargoStatus  = null;
        }
      });
    }
  }

  updateStatus(): void {
    if (this.updateCargoId && this.newStatus) {
      this.service.updateCargoStatus(this.newStatus, this.updateCargoId).subscribe({
        next: () => {
          this.successMessage = 'Status updated successfully!';
          this.errorMessage   = '';
        },
        error: () => {
          this.errorMessage   = 'Failed to update status. Please try again.';
          this.successMessage = '';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}