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
  otpForm: FormGroup;
  forgotForm: FormGroup;

  loginError = false;
  loginLoading = false;
  message = '';
  showPassword = false;

  showOtpModal = false;
  otpLoading = false;
  otpError = false;
  otpSuccess = false;
  private challengeId = '';

  showForgotModal = false;
  resetLoading = false;
  forgotSuccess = '';
  forgotError = '';

  constructor(
    private fb: FormBuilder,
    private service: HttpService,
    private authService: AuthService,
    private router: Router
  ) {
    this.itemForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z0-9]+$')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&^])[A-Za-z0-9@$!%*#?&^]{8,}$')]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });

    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&^]).{8,}$')]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.matchPasswords });
  }

  login(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }
    this.loginLoading = true;
    this.loginError = false;
    this.message = '';

    this.service.Login(this.itemForm.value).subscribe({
      next: (res: any) => {
        this.loginLoading = false;
        if (res && res.token) {
          this.finalizeLogin(res.token, res.role);
        } else if (res?.otpRequired || res?.challengeId) {
          this.challengeId = res.challengeId || '';
          this.showOtpModal = true;
          this.message = 'OTP sent to your registered email. Please enter OTP to continue.';
        }
      },
      error: (err) => {
        this.loginLoading = false;
        this.loginError = true;
        this.message = err?.error?.message || 'Invalid username or password.';
      }
    });
  }

  verifyOtp(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }
    this.otpLoading = true;
    this.otpError = false;
    const otpValue = (this.otpForm.value.otp || '').trim();

    this.service.verifyOtp({ challengeId: this.challengeId, otp: otpValue }).subscribe({
      next: (res: any) => {
        this.otpLoading = false;
        if (res && res.token) {
          this.otpSuccess = true;
          this.finalizeLogin(res.token, res.role);
        } else {
          this.otpError = true;
          this.message = 'Verification failed. Missing token.';
        }
      },
      error: (err) => {
        this.otpLoading = false;
        this.otpError = true;
        this.message = err?.error?.message || 'Invalid or expired OTP.';
      }
    });
  }

  resendOtp(): void {
    if (this.itemForm.invalid) return;
    this.otpLoading = true;
    this.service.Login(this.itemForm.value).subscribe({
      next: (res: any) => {
        this.otpLoading = false;
        if (res?.challengeId) this.challengeId = res.challengeId;
        this.message = 'OTP resent successfully.';
      },
      error: () => { this.otpLoading = false; this.otpError = true; }
    });
  }

  private finalizeLogin(token: string, role?: string): void {
    this.authService.setToken(token);
    if (role) this.authService.setRole(role);
    this.authService.setLoginStatus(true);
    this.showOtpModal = false;
    setTimeout(() => this.router.navigateByUrl('/dashboard'), 300);
  }

  private matchPasswords(control: AbstractControl) {
    const p = control.get('newPassword')?.value;
    const c = control.get('confirmPassword')?.value;
    return p === c ? null : { mismatch: true };
  }

  togglePassword() { this.showPassword = !this.showPassword; }
  cancelOtp() { this.showOtpModal = false; this.message = ''; }
  openForgot(e: Event) { e.preventDefault(); this.showForgotModal = true; }
  closeForgot() { this.showForgotModal = false; }
  resetPassword() { 
    if (this.forgotForm.invalid) { this.forgotForm.markAllAsTouched(); return; }
    this.resetLoading = true;
    this.service.resetPassword({ email: this.forgotForm.value.email, newPassword: this.forgotForm.value.newPassword }).subscribe({
      next: () => { this.resetLoading = false; this.forgotSuccess = 'Password updated!'; setTimeout(() => this.closeForgot(), 1500); },
      error: (err) => { this.resetLoading = false; this.forgotError = err?.error?.message || 'Reset failed'; }
    });
  }
}