import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
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
  registerSuccess: boolean = false;
  registerError: boolean = false;
 
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
 
  /* ===== SUBMIT ===== */
  register() {
    if (this.itemForm.valid) {
      this.service.registerUser(this.itemForm.value).subscribe({
        next: () => {
          this.registerSuccess = true;
          setTimeout(() => {
            this.registerSuccess = false;
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: () => {
          this.registerError = true;
        }
      });
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}