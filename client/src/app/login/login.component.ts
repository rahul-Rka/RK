

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  itemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: HttpService,
    private authService: AuthService,
    private router: Router
  ) {
    this.itemForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.itemForm.valid) {
      this.service.Login(this.itemForm.value).subscribe({
        next: (res: any) => {
          this.authService.setToken(res.token);
          this.authService.setRole(res.role);
          this.authService.setLoginStatus(true);
          this.router.navigate(['/dashboard']);  
        },
        error: () => alert('Invalid username or password')
      });
    }
  }
}