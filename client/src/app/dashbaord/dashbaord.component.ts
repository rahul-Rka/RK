// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-dashbaord',
//   templateUrl: './dashbaord.component.html',
//   styleUrls: ['./dashbaord.component.scss']
// })
// export class DashbaordComponent {

// }

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

  constructor(private authService: AuthService, private service: HttpService) {}

  ngOnInit(): void {
    this.role = this.authService.getRole;
    if (this.role === 'BUSINESS') {
      this.loadCargos();
      this.loadDrivers();
    } else if (this.role === 'DRIVER') {
      this.loadAssignedCargos();
    }
  }

  loadCargos() {
    this.service.getCargo().subscribe((res: any) => this.cargos = res);
  }

  loadDrivers() {
    this.service.getDrivers().subscribe((res: any) => this.drivers = res);
  }

  loadAssignedCargos() {
    const driverId = 1; // replace with actual logged-in driver id if available
    this.service.getAssignOrders(driverId).subscribe((res: any) => this.assignedCargos = res);
  }

  viewCargoStatus() {
    this.service.getOrderStatus(this.cargoIdInput).subscribe((res: any) => this.cargoStatus = res);
  }
}