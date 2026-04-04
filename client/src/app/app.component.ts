import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // Routes accessible without login
  private publicRoutes = ['/login', '/registration'];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const currentUrl = this.router.url.split('?')[0];

    if (!this.authService.getLoginStatus && !this.publicRoutes.includes(currentUrl)) {
      this.router.navigateByUrl('/login');
    }
  }

  get IsLoggin(): boolean {
    return this.authService.getLoginStatus;
  }

  get roleName(): string {
    return this.authService.getRole;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}