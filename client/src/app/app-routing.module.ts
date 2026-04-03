import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AddcargoComponent } from './addcargo/addcargo.component';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { AssginCargoComponent } from './assgin-cargo/assgin-cargo.component';
import { ViewcargostatusComponent } from './viewcargostatus/viewcargostatus.component';
import { AuthGuard } from './gaurds/auth.guard';
import { RoleGuard } from './gaurds/role.guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },

  // ✅ any logged-in role can access dashboard
  { path: 'dashboard', component: DashbaordComponent, canActivate: [AuthGuard] },

  // ✅ BUSINESS-only pages
  { path: 'add-cargo', component: AddcargoComponent, canActivate: [RoleGuard], data: { roles: ['BUSINESS'] } },
  { path: 'assign-cargo', component: AssginCargoComponent, canActivate: [RoleGuard], data: { roles: ['BUSINESS'] } },

  // ✅ BUSINESS + DRIVER + CUSTOMER can access
  { path: 'view-cargo-status', component: ViewcargostatusComponent, canActivate: [RoleGuard], data: { roles: ['BUSINESS', 'DRIVER', 'CUSTOMER'] } },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}