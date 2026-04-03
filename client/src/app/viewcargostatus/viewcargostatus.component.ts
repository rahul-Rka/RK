import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-viewcargostatus',
  templateUrl: './viewcargostatus.component.html',
  styleUrls:['./viewcargostatus.component.scss']
  
})
export class ViewcargostatusComponent implements OnInit {

  role = '';

  // ✅ Common list
  cargos: any[] = [];

  // ✅ Driver-only fields
  updateCargoId: number | null = null;
  newStatus = '';
  successMessage = '';
  errorMessage = '';

  constructor(private service: HttpService, private router: Router) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';

    // ✅ CUSTOMER DASHBOARD
    if (this.role === 'CUSTOMER') {
      this.service.getCustomerCargos().subscribe({
        next: (res: any) => this.cargos = res,
        error: (err: any) => console.error(err)
      });
    }

    // ✅ DRIVER DASHBOARD
    if (this.role === 'DRIVER') {
      this.service.getAssignOrders().subscribe({
        next: (res: any) => this.cargos = res,
        error: (err: any) => console.error(err)
      });
    }
  }

  // ✅ DRIVER ONLY: update status
  updateStatus(): void {
    if (this.updateCargoId && this.newStatus) {
      this.service.updateCargoStatus(this.updateCargoId, this.newStatus).subscribe({
        next: () => {
          this.successMessage = 'Status updated successfully!';
          this.errorMessage = '';
        },
        error: () => {
          this.errorMessage = 'Failed to update status.';
          this.successMessage = '';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}