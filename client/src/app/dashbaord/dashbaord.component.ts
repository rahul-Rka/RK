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

  role: string = '';

  cargos: any[] = [];
  drivers: any[] = [];
  assignedCargos: any[] = [];

  constructor(
    private authService: AuthService,
    private service: HttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole;

    if (this.role === 'BUSINESS') {
      this.loadCargos();
      this.loadDrivers();
    }

    if (this.role === 'DRIVER') {
      this.loadAssignedCargos();
    }
  }

  loadCargos() {
    this.service.getCargo().subscribe({
      next: (res: any) => this.cargos = res,
      error: err => console.error(err)
    });
  }

  loadDrivers() {
    this.service.getDrivers().subscribe({
      next: (res: any) => this.drivers = res,
      error: err => console.error(err)
    });
  }

  loadAssignedCargos() {
    this.service.getAssignOrders().subscribe({
      next: (res: any) => this.assignedCargos = res,
      error: err => console.error(err)
    });
  }

  goToViewCargo() {
    this.router.navigate(['/view-cargo-status']);
  }
}