import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent {
  itemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: HttpService,
    private router: Router       
  ) {
    this.itemForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  register() {
    if (this.itemForm.valid) {
      this.service.registerUser(this.itemForm.value).subscribe({
        next: () => this.router.navigate(['/login']),  // ← navigate after success
        error: () => alert('Registration failed. Please try again.')
      });
    }
  }
}