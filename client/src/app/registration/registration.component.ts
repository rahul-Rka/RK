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
 
  constructor(
    private fb: FormBuilder,
    private service: HttpService,
    private router: Router
  ) {
    this.itemForm = this.fb.group({
      username: ['', [
        Validators.required,
        this.minLengthCustom(5),
        this.alphaNumericValidator
      ]],
      password: ['', [
        Validators.required,
        this.passwordStrengthValidator
      ]],
      email: ['', [
        Validators.required,
        this.emailCustomValidator
      ]],
      role: ['', [
        this.roleRequiredValidator
      ]]
    });
  }
 
  /* ======== CUSTOM VALIDATORS (SAME CLASS) ======== */
 
  minLengthCustom(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return control.value.length >= min
        ? null
        : { minLengthCustom: true };
    };
  }
 
  alphaNumericValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(control.value)
      ? null
      : { alphaNumeric: true };
  }
 
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const regex = /^(?=.*[0-9]).{6,}$/;
    return regex.test(control.value)
      ? null
      : { passwordStrength: true };
  }
 
  emailCustomValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(control.value)
      ? null
      : { emailCustom: true };
  }
 
  roleRequiredValidator(control: AbstractControl): ValidationErrors | null {
    return control.value
      ? null
      : { roleRequired: true };
  }
 
  /* ======== GETTERS FOR TEMPLATE ======== */
  get username() { return this.itemForm.get('username'); }
  get password() { return this.itemForm.get('password'); }
  get email() { return this.itemForm.get('email'); }
  get role() { return this.itemForm.get('role'); }
 
  /* ======== SUBMIT ======== */
  register() {
    if (this.itemForm.valid) {
      this.service.registerUser(this.itemForm.value).subscribe({
        next: () => this.router.navigate(['/login']),
        error: () => alert('Registration failed. Please try again.')
      });
    }
  }
}