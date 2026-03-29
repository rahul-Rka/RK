/* =========================================================
   File: src/app/registration/registration.component.ts
   ========================================================= */

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent {

  itemForm: FormGroup;

  constructor(private fb: FormBuilder, private service: HttpService) {
    this.itemForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  register() {
    if (this.itemForm.valid) {
      this.service.registerUser(this.itemForm.value).subscribe();
    }
  }
}