import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-addcargo',
  templateUrl: './addcargo.component.html',
  styleUrls: ['./addcargo.component.scss']
})
export class AddcargoComponent {

  itemForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private service: HttpService,
    private router: Router
  ) {
    this.itemForm = this.fb.group({
      content: ['', Validators.required],
      size: ['', Validators.required],

      // ✅ NEW: Source Location required for driver filtering
      sourceLocation: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.itemForm.valid) {
      this.service.addCargo(this.itemForm.value).subscribe({
        next: () => {
          this.successMessage = 'Cargo added successfully!';
          this.errorMessage = '';
          this.itemForm.reset();
        },
        error: () => {
          this.errorMessage = 'Failed to add cargo. Please try again.';
          this.successMessage = '';
        }
      });
    } else {
      this.itemForm.markAllAsTouched();
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}