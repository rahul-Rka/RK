import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {

  role: string = '';
  cargos: any[] = [];
  drivers: any[] = [];
  assignedCargos: any[] = [];
  cargoStatus: any = null;
  cargoIdInput: number = 0;

  constructor(
    private authService: AuthService,
    private service: HttpService
  ) {}

  ngOnInit(): void {
    // ✅ FIXED (IMPORTANT)
    this.role = this.authService.getRole;

    if (this.role === 'BUSINESS') {
      this.loadCargos();
      this.loadDrivers();
    } else if (this.role === 'DRIVER') {
      this.loadAssignedCargos();
    }
  }

  loadCargos() {
    this.service.getCargo().subscribe({
      next: (res: any) => this.cargos = res,
      error: (err) => console.error(err)
    });
  }

  loadDrivers() {
    this.service.getDrivers().subscribe({
      next: (res: any) => this.drivers = res,
      error: (err) => console.error(err)
    });
  }

  loadAssignedCargos() {
    const driverId = 1; // replace later with actual logged user id
    this.service.getAssignOrders(driverId).subscribe({
      next: (res: any) => this.assignedCargos = res,
      error: (err) => console.error(err)
    });
  }

  viewCargoStatus() {
    this.service.getOrderStatus(this.cargoIdInput).subscribe({
      next: (res: any) => this.cargoStatus = res,
      error: (err) => console.error(err)
    });
  }
}