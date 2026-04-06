import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-assgin-cargo',
  templateUrl: './assgin-cargo.component.html',
  styleUrls: ['./assgin-cargo.component.scss']
})
export class AssginCargoComponent implements OnInit {

  cargos: any[] = [];
  drivers: any[] = [];
  customers: any[] = [];

  selectedCargoId: number | null = null;
  selectedDriverId: number | null = null;
  selectedCustomerId: number | null = null;

  successMessage = '';
  errorMessage = '';
  role = '';

  // Location-based filtering (your feature)
  selectedCargoLocation = '';

  // Feedback dashboard state (friend feature)
  feedbackCargos: any[] = [];
  feedbackSummary: any = null;
  feedbackLoadError = '';
  loadingFeedback = false;

  constructor(private service: HttpService, private router: Router) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';

    if (this.role === 'BUSINESS') {
      this.loadBaseLists();
      this.loadFeedbackDashboard();
    }
  }

  private loadBaseLists(): void {
    this.service.getCargo().subscribe({
      next: (data: any) => this.cargos = Array.isArray(data) ? data : [],
      error: () => this.cargos = []
    });

    // initial drivers list (no location filter yet)
    this.service.getDrivers().subscribe({
      next: (data: any) => this.drivers = Array.isArray(data) ? data : [],
      error: () => this.drivers = []
    });

    this.service.getCustomers().subscribe({
      next: (data: any) => this.customers = Array.isArray(data) ? data : [],
      error: () => this.customers = []
    });
  }

  // Called when cargo dropdown changes
  onCargoChange(): void {
    const selectedCargo = this.cargos.find(c => c.id === this.selectedCargoId);

    // reset driver selection whenever cargo changes
    this.selectedDriverId = null;

    if (!selectedCargo) {
      this.selectedCargoLocation = '';
      this.service.getDrivers().subscribe({
        next: (data: any) => this.drivers = Array.isArray(data) ? data : [],
        error: () => this.drivers = []
      });
      return;
    }

    this.selectedCargoLocation = selectedCargo.sourceLocation || '';

    // if cargo has no location → show all drivers
    if (!this.selectedCargoLocation) {
      this.service.getDrivers().subscribe({
        next: (data: any) => this.drivers = Array.isArray(data) ? data : [],
        error: () => this.drivers = []
      });
      return;
    }

    // filter drivers by location (maps to /api/business/drivers?location=...)
    this.service.getDriversByLocation(this.selectedCargoLocation).subscribe({
      next: (data: any) => this.drivers = Array.isArray(data) ? data : [],
      error: () => this.drivers = []
    });
  }

  assign(): void {
    if (this.selectedCargoId && this.selectedDriverId && this.selectedCustomerId) {
      this.service.assignCargo(this.selectedCargoId, this.selectedDriverId, this.selectedCustomerId)
        .subscribe({
          next: () => {
            this.successMessage = 'Cargo assigned successfully!';
            this.errorMessage = '';

            // reset selections
            this.selectedCargoId = null;
            this.selectedDriverId = null;
            this.selectedCustomerId = null;
            this.selectedCargoLocation = '';

            // refresh cargo list + drivers list
            this.loadBaseLists();

            setTimeout(() => this.router.navigate(['/dashboard']), 1200);
          },
          error: () => {
            this.errorMessage = 'Failed to assign cargo.';
            this.successMessage = '';
          }
        });
    }
  }

  //  Loads feedback list + summary (friend feature)
  loadFeedbackDashboard(): void {
    this.loadingFeedback = true;
    this.feedbackLoadError = '';

    this.service.getAllFeedbacks().subscribe({
      next: (res: any) => {
        this.feedbackCargos = Array.isArray(res) ? res : [];
        this.loadingFeedback = false;
      },
      error: (err: any) => {
        const msg = err?.error?.message || err?.message || 'Failed to load feedback list.';
        const code = err?.status ? ` (HTTP ${err.status})` : '';
        this.feedbackLoadError = msg + code;
        this.loadingFeedback = false;
        console.error('Feedbacks API error:', err);
      }
    });

    this.service.getFeedbackSummary().subscribe({
      next: (res: any) => {
        this.feedbackSummary = res || null;
      },
      error: (err: any) => {
        console.error('Feedback summary API error:', err);
      }
    });
  }

  // Helpers
  stars(rating: number): string {
    const r = Math.max(0, Math.min(5, Number(rating || 0)));
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }

  safeNumber(n: any, digits = 1): string {
    const v = Number(n);
    return isNaN(v) ? '0.0' : v.toFixed(digits);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
