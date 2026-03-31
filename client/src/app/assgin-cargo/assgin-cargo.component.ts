
// import { Component } from '@angular/core';
// import { HttpService } from '../../services/http.service';


// @Component({
//   selector: 'app-assgin-cargo',
//   templateUrl: './assgin-cargo.component.html'
// })
// export class AssginCargoComponent {

//   constructor(private service: HttpService) {}

//   assign(driverId: number, cargoId: number) {
//     this.service.assignDriver(driverId, cargoId).subscribe();
//   }
// }

import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-assgin-cargo',
  templateUrl: './assgin-cargo.component.html'
})
export class AssginCargoComponent {
  cargoId: number = 0;
  driverId: number = 0;
  message: string = '';

  constructor(private service: HttpService) {}

  assign(driverId: number, cargoId: number) {
    this.service.assignDriver(driverId, cargoId).subscribe({
      next: () => this.message = 'Cargo assigned successfully!',
      error: () => this.message = 'Assignment failed.'
    });
  }
}