import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AddcargoComponent } from './addcargo/addcargo.component';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { AssginCargoComponent } from './assgin-cargo/assgin-cargo.component';
import { ViewcargostatusComponent } from './viewcargostatus/viewcargostatus.component';

const routes: Routes = [
  { path: 'login',             component: LoginComponent },
  { path: 'registration',      component: RegistrationComponent },
  { path: 'dashboard',         component: DashbaordComponent },
  { path: 'add-cargo',         component: AddcargoComponent },
  { path: 'assign-cargo',      component: AssginCargoComponent },
  { path: 'view-cargo-status', component: ViewcargostatusComponent },
  { path: '',                  redirectTo: '/login', pathMatch: 'full' },
  { path: '**',                redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}