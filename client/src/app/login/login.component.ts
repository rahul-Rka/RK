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

  // login state
  loginError = false;
  loginLoading = false;
  message = '';

  showPassword = false;

  // OTP state
  showOtpModal = false;
  otpLoading = false;
  otpError = false;
  otpSuccess = false;
  private challengeId = '';

  // forgot password state
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
        // ✅ TypeScript regex must use '&' (NOT '&amp;')
        Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&^])[A-Za-z0-9@$!%*#?&^]{8,}$')
      ]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
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

  /* ================= LOGIN (STEP-1) ================= */
  login(): void {
    if (!this.itemForm.valid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.loginError = false;
    this.message = '';
    this.loginLoading = true;

    this.service.Login(this.itemForm.value).subscribe({
      next: (res: any) => {
        this.loginLoading = false;

        // If backend still returns token directly (backward compatibility)
        if (res && res.token) {
          this.finalizeLogin(res.token, res.role);
          return;
        }

        // OTP flow response
        if (res?.otpRequired === true || res?.challengeId) {
          this.challengeId = res?.challengeId || '';
          this.showOtpModal = true;
          this.otpError = false;
          this.otpSuccess = false;
          this.otpForm.reset();
          this.message = 'OTP sent to your registered email. Please enter OTP to continue.';
          return;
        }

        // Unexpected response
        this.loginError = true;
        this.message = 'Login response invalid. Please try again.';
      },
      error: () => {
        this.loginLoading = false;
        this.loginError = true;
        this.message = 'Invalid username or password.';
      }
    });
  }

  /* ================= OTP (STEP-2) ================= */
  verifyOtp(): void {
    if (!this.otpForm.valid) {
      this.otpForm.markAllAsTouched();
      this.otpError = true;
      this.message = 'Enter a valid 6 digit OTP.';
      return;
    }

    this.otpLoading = true;
    this.otpError = false;
    this.otpSuccess = false;

    const otpValue = (this.otpForm.value.otp || '').trim();

    this.service.verifyOtp({ challengeId: this.challengeId, otp: otpValue }).subscribe({
      next: (res: any) => {
        this.otpLoading = false;

        if (res && res.token) {
          this.otpSuccess = true;
          this.message = 'OTP verified. Logging in...';
          this.finalizeLogin(res.token, res.role);
          return;
        }

        this.otpError = true;
        this.message = res?.message || 'OTP verified but token missing. Check backend response.';
      },
      error: (err: any) => {
        this.otpLoading = false;
        this.otpError = true;
        this.message = err?.error?.message || 'Invalid or expired OTP.';
      }
    });
  }

  // ✅ Resend OTP (re-trigger login step-1 again using same credentials)
  resendOtp(): void {
    // resend by calling /api/login again (backend generates new challengeId + OTP)
    if (!this.itemForm.valid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.otpLoading = true;
    this.otpError = false;
    this.otpSuccess = false;

    this.service.Login(this.itemForm.value).subscribe({
      next: (res: any) => {
        this.otpLoading = false;

        if (res?.challengeId) {
          this.challengeId = res.challengeId;
          this.message = 'OTP resent successfully. Please check your email.';
          return;
        }

        this.message = 'OTP resent. Please check your email.';
      },
      error: () => {
        this.otpLoading = false;
        this.otpError = true;
        this.message = 'Failed to resend OTP.';
      }
    });
  }

  cancelOtp(): void {
    this.showOtpModal = false;
    this.challengeId = '';
    this.otpForm.reset();
    this.otpError = false;
    this.otpSuccess = false;
    this.message = '';
  }

  private finalizeLogin(token: string, role?: string): void {
    this.authService.setToken(token);
    if (role) this.authService.setRole(role);
    this.authService.setLoginStatus(true);

    // close otp modal if open
    this.showOtpModal = false;

    setTimeout(() => {
      this.router.navigateByUrl('/dashboard');
    }, 300);
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
