
import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-viewcargostatus',
  templateUrl: './viewcargostatus.component.html'
})
export class ViewcargostatusComponent {
  cargoId: number = 0;
  newStatus: string = '';
  message: string = '';

  constructor(private service: HttpService) {}

  viewStatus(id: number) {
    this.service.getOrderStatus(id).subscribe();
  }

  updateStatus() {
    this.service.updateCargoStatus(this.newStatus, this.cargoId).subscribe({
      next: () => this.message = 'Status updated successfully!',
      error: () => this.message = 'Update failed.'
    });
  }
}