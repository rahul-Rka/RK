/* =========================================================
   File: src/app/login/login.component.ts
   ========================================================= */

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  itemForm: FormGroup;

  constructor(private fb: FormBuilder, private service: HttpService) {
    this.itemForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.itemForm.valid) {
      this.service.Login(this.itemForm.value).subscribe();
    }
  }
}