import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent {

  itemForm: FormGroup;
  registerSuccess = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private service: HttpService,
    private router: Router
  ) {

    this.itemForm = this.fb.group({

      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('^[a-zA-Z0-9]+$')
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&^])[A-Za-z0-9@$!%*#?&^]+$'
          )
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      role: [
        '',
        Validators.required
      ]
    });
  }

  /* ===== REGISTER ===== */
  register() {
    if (this.itemForm.valid) {

      this.errorMessage = '';

      this.service.registerUser(this.itemForm.value).subscribe({
        next: () => {
          this.registerSuccess = true;

          setTimeout(() => {
            this.registerSuccess = false;
            this.router.navigate(['/login']);
          }, 1500);
        },

        error: (err) => {
          if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = err.error?.message || 'Registration failed';
          }
        }

      });

    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}