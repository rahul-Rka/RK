/* =========================================================
   File: src/app/addcargo/addcargo.component.ts
   ========================================================= */

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'app-addcargo',
  templateUrl: './addcargo.component.html'
})
export class AddcargoComponent {

  itemForm: FormGroup;

  constructor(private fb: FormBuilder, private service: HttpService) {
    this.itemForm = this.fb.group({
      content: ['', Validators.required],
      size: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  submit() {
    if (this.itemForm.valid) {
      this.service.addCargo(this.itemForm.value).subscribe();
    }
  }
}