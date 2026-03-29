/* =========================================================
   File: src/app/viewcargostatus/viewcargostatus.component.ts
   ========================================================= */

import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'app-viewcargostatus',
  templateUrl: './viewcargostatus.component.html'
})
export class ViewcargostatusComponent {

  constructor(private service: HttpService) {}

  viewStatus(id: number) {
    this.service.getOrderStatus(id).subscribe();
  }
}