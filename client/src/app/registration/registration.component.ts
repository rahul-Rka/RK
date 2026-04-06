import { Component } from '@angular/core';

import {

  FormBuilder,

  FormGroup,

  Validators

} from '@angular/forms';

import { Router } from '@angular/router';

import { HttpService } from '../../services/http.service';

@Component({

  selector: 'app-registration',

  templateUrl: './registration.component.html',

  styleUrls: ['./registration.component.scss']

})

export class RegistrationComponent {

  itemForm: FormGroup;

  registerSuccess = false;

  errorMessage = '';

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

            '^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&amp;^])[A-Za-z0-9@$!%*#?&amp;^]+$'

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

      ],

      /* ADDED: Driver fields */

      age: [{ value: '', disabled: true }],

      licenseNumber: [{ value: '', disabled: true }]

    });

    /* ADDED: Role based enable/disable + validators */

    this.itemForm.get('role')?.valueChanges.subscribe((role) => {

      const ageCtrl = this.itemForm.get('age');

      const licenseCtrl = this.itemForm.get('licenseNumber');

      if (role === 'DRIVER') {

        // Enable age and validate

        ageCtrl?.enable({ emitEvent: false });

        ageCtrl?.setValidators([

          Validators.required,

          Validators.min(18),

          Validators.pattern('^[0-9]+$')

        ]);

        ageCtrl?.updateValueAndValidity({ emitEvent: false });

        // License only when age >=18, so disable now

        licenseCtrl?.reset('', { emitEvent: false });

        licenseCtrl?.disable({ emitEvent: false });

        licenseCtrl?.clearValidators();

        licenseCtrl?.updateValueAndValidity({ emitEvent: false });

      } else {

        // Non-driver => disable and clear

        ageCtrl?.reset('', { emitEvent: false });

        ageCtrl?.disable({ emitEvent: false });

        ageCtrl?.clearValidators();

        ageCtrl?.updateValueAndValidity({ emitEvent: false });

        licenseCtrl?.reset('', { emitEvent: false });

        licenseCtrl?.disable({ emitEvent: false });

        licenseCtrl?.clearValidators();

        licenseCtrl?.updateValueAndValidity({ emitEvent: false });

      }

    });

    /*  When age >= 18 => enable license & validate pattern */

    this.itemForm.get('age')?.valueChanges.subscribe((ageVal) => {

      const role = this.itemForm.get('role')?.value;

      const licenseCtrl = this.itemForm.get('licenseNumber');

      if (role !== 'DRIVER') return;

      const age = Number(ageVal);

      if (!isNaN(age) && age >= 18) {

        licenseCtrl?.enable({ emitEvent: false });

        licenseCtrl?.setValidators([

          Validators.required,

          // Format: SS-RRRRYYYYNNNNNNN

          // SS = 2 letters, RRRR = 4 digits, YYYY = 4 digits, NNNNNNN = 7 digits

          Validators.pattern('^[A-Za-z]{2}-\\d{4}\\d{4}\\d{7}$')

        ]);

        licenseCtrl?.updateValueAndValidity({ emitEvent: false });

      } else {

        licenseCtrl?.reset('', { emitEvent: false });

        licenseCtrl?.disable({ emitEvent: false });

        licenseCtrl?.clearValidators();

        licenseCtrl?.updateValueAndValidity({ emitEvent: false });

      }

    });

  }

  /* ===== REGISTER ===== */

  register() {

    if (this.itemForm.valid) {

      this.errorMessage = '';

      this.service.registerUser(this.itemForm.value).subscribe({

        next: () => {

          this.registerSuccess = true;

          setTimeout(() => {

            this.registerSuccess = false;

            this.router.navigate(['/login']);

          }, 1500);

        },

        error: (err) => {

          if (typeof err.error === 'string') {

            this.errorMessage = err.error;

          } else {

            this.errorMessage = err.error?.message || 'Registration failed';

          }

        }

      });

    } else {

      this.itemForm.markAllAsTouched();

    }

  }

}

