import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {

    if (!this.auth.getLoginStatus) {
      return this.router.parseUrl('/login');
    }

    const allowedRoles = route.data['roles'] as string[] | undefined;
    const userRole = this.auth.getRole;

    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    if (allowedRoles.includes(userRole)) {
      return true;
    }

    return this.router.parseUrl('/dashboard');
  }
}