import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  itemForm: FormGroup;
  loginError = false;
  loginSuccess = false;

  showPassword = false;

  showForgotModal = false;
  resetLoading = false;

  forgotSuccess = '';
  forgotError = '';

  forgotForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: HttpService,
    private authService: AuthService,
    private router: Router
  ) {

    this.itemForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern('^[a-zA-Z0-9]+$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        // ✅ TS regex MUST use '&' not '&amp;'
        Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&^])[A-Za-z0-9@$!%*#?&^]{8,}$')
      ]]
    });

    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&^]).{8,}$')
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.matchPasswords });

  }

  /* ================= LOGIN ================= */
  login(): void {
    if (!this.itemForm.valid) {
      this.itemForm.markAllAsTouched();
      return;
    }

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
        }, 500);
      },
      error: () => {
        this.loginError = true;
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /* ================= FORGOT MODAL ================= */
  openForgot(e: Event): void {
    e.preventDefault();
    this.forgotError = '';
    this.forgotSuccess = '';
    this.resetLoading = false;
    this.forgotForm.reset();
    this.showForgotModal = true;
  }

  closeForgot(): void {
    this.showForgotModal = false;
    this.forgotForm.reset();
    this.forgotError = '';
    this.forgotSuccess = '';
    this.resetLoading = false;
  }

  /* ================= RESET PASSWORD ================= */
  resetPassword(): void {
    if (!this.forgotForm.valid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.resetLoading = true;
    this.forgotError = '';
    this.forgotSuccess = '';

    const payload = {
      email: this.forgotForm.value.email,
      newPassword: this.forgotForm.value.newPassword
    };

    this.service.resetPassword(payload).subscribe({
      next: () => {
        this.resetLoading = false;
        this.forgotSuccess = 'Password updated successfully';
        setTimeout(() => this.closeForgot(), 1200);
      },
      error: (err) => {
        this.resetLoading = false;
        this.forgotError =
          err?.error?.message ||
          err?.error ||
          err?.message ||
          'Reset failed';
      }
    });
  }

  private matchPasswords(control: AbstractControl) {
    const p = control.get('newPassword')?.value;
    const c = control.get('confirmPassword')?.value;
    return p === c ? null : { mismatch: true };
  }
}