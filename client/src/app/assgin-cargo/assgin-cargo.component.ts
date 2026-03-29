/* =========================================================
   File: src/app/assgin-cargo/assgin-cargo.component.ts
   ========================================================= */

import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'app-assgin-cargo',
  templateUrl: './assgin-cargo.component.html'
})
export class AssginCargoComponent {

  constructor(private service: HttpService) {}

  assign(driverId: number, cargoId: number) {
    this.service.assignDriver(driverId, cargoId).subscribe();
  }
}