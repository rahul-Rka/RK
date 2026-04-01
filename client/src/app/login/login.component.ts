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
  loginError: boolean = false;
  constructor(
    private fb: FormBuilder,
    private service: HttpService,
    private authService: AuthService,
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
          Validators.minLength(6),
          Validators.pattern('^(?=.*[0-9]).*$')
        ]
      ]
    });
  }
  login() {
    if (this.itemForm.valid) {
      this.loginError = false;
      this.service.Login(this.itemForm.value).subscribe({
        next: (res: any) => {
          this.authService.setToken(res.token);
          this.authService.setRole(res.role);
          this.authService.setLoginStatus(true);
          this.router.navigateByUrl('/dashboard');
        },
        error: () => {
          this.loginError = true;
        }
      });
    }
  }
}