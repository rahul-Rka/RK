import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AddcargoComponent } from './addcargo/addcargo.component';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { AssginCargoComponent } from './assgin-cargo/assgin-cargo.component';
import { ViewcargostatusComponent } from './viewcargostatus/viewcargostatus.component';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [

  //  AUTH
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },

  // PROTECTED ROUTES
  { path: 'dashboard', component: DashbaordComponent, canActivate: [AuthGuard] },
  { path: 'add-cargo', component: AddcargoComponent, canActivate: [AuthGuard] },
  { path: 'assign-cargo', component: AssginCargoComponent, canActivate: [AuthGuard] },
  { path: 'view-cargo-status', component: ViewcargostatusComponent, canActivate: [AuthGuard] },

  // Keep "/" as-is (Landing UI will appear from AppComponent)
  { path: '', pathMatch: 'full', component: LoginComponent }, 
 
  // Unknown routes -> go to main page
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}