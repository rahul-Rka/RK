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
  loginSuccess: boolean = false;
 
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
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&^])[A-Za-z0-9@$!%*#?&^]{8,}$'
          )
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
 
          this.loginSuccess = true;
 
          setTimeout(() => {
            this.loginSuccess = false;
            this.router.navigateByUrl('/dashboard');
          }, 1500);
        },
        error: () => {
          this.loginError = true;
        }
      });
 
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}