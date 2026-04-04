import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-viewcargostatus',
  templateUrl: './viewcargostatus.component.html',
  styleUrls: ['./viewcargostatus.component.scss']
})
export class ViewcargostatusComponent implements OnInit, OnDestroy {

  role = '';
  cargos: any[] = [];

  // ✅ DRIVER: per-row dropdown values
  selectedStatusByCargoId: { [cargoId: number]: string } = {};

  successMessage = '';
  errorMessage = '';

  // ✅ FEEDBACK form values per cargo
  feedbackRating: { [cargoId: number]: number } = {};
  feedbackComment: { [cargoId: number]: string } = {};
  feedbackSuccessByCargo: { [cargoId: number]: string } = {};
  feedbackErrorByCargo: { [cargoId: number]: string } = {};

  // ✅ Auto refresh for customer view
  private refreshSub?: Subscription;

  constructor(private service: HttpService, private router: Router) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.loadCargos();

    if (this.role === 'CUSTOMER') {
      this.refreshSub = interval(5000).subscribe(() => this.loadCargos());
    }
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  refresh(): void {
    this.loadCargos();
  }

  loadCargos(): void {
    if (this.role === 'CUSTOMER') {
      this.service.getCustomerCargos().subscribe({
        next: (res: any) => this.cargos = Array.isArray(res) ? res : [],
        error: (err: any) => console.error(err)
      });
      return;
    }

    if (this.role === 'DRIVER') {
      this.service.getAssignOrders().subscribe({
        next: (res: any) => this.cargos = Array.isArray(res) ? res : [],
        error: (err: any) => console.error(err)
      });
      return;
    }

    this.cargos = [];
  }

  // ✅ 4-step mapping: Ordered, Packed, In Transit, Delivered
  getStep(cargo: any): number {
    const status = (cargo?.status || '').toUpperCase();
    const hasDriver = !!cargo?.driver;

    if (status === 'DELIVERED') return 4;
    if (status === 'IN_TRANSIT') return 3;
    if (hasDriver) return 2;
    return 1;
  }

  // ✅ DRIVER: update status
  updateStatus(cargoId: number): void {
    const newStatus = (this.selectedStatusByCargoId[cargoId] || '').trim();
    if (!newStatus) return;

    this.service.updateCargoStatus(cargoId, newStatus).subscribe({
      next: () => {
        this.successMessage = 'Status updated successfully!';
        this.errorMessage = '';
        this.loadCargos();
        this.selectedStatusByCargoId[cargoId] = '';
      },
      error: () => {
        this.errorMessage = 'Failed to update status.';
        this.successMessage = '';
      }
    });
  }

  // ✅ CUSTOMER: submit feedback
  submitFeedbackForCargo(cargo: any): void {
    const cargoId = cargo?.id;
    if (!cargoId) return;

    this.feedbackSuccessByCargo[cargoId] = '';
    this.feedbackErrorByCargo[cargoId] = '';

    const status = (cargo?.status || '').toUpperCase();
    if (status !== 'DELIVERED') {
      this.feedbackErrorByCargo[cargoId] = 'Feedback allowed only after delivery.';
      return;
    }

    if (cargo?.feedbackRating != null) {
      this.feedbackErrorByCargo[cargoId] = 'Feedback already submitted for this cargo.';
      return;
    }

    const rating = this.feedbackRating[cargoId];
    const comment = (this.feedbackComment[cargoId] || '').trim();

    if (!rating || rating < 1 || rating > 5) {
      this.feedbackErrorByCargo[cargoId] = 'Please select rating between 1 and 5.';
      return;
    }

    this.service.submitFeedback(cargoId, rating, comment).subscribe({
      next: (res: any) => {
        this.feedbackErrorByCargo[cargoId] = '';
        this.feedbackSuccessByCargo[cargoId] = res?.message || 'Feedback submitted successfully ✅';
        this.feedbackRating[cargoId] = 0 as any;
        this.feedbackComment[cargoId] = '';
        this.loadCargos();
      },
      error: (err: any) => {
        this.feedbackErrorByCargo[cargoId] =
          err?.error?.message || 'Failed to submit feedback.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}