


import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn: boolean = false;
  private role: string = '';

  constructor() {
    // Restore session from localStorage on init
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    if (token && savedRole) {
      this.loggedIn = true;
      this.role = savedRole;
    }
  }

  setLoginStatus(status: boolean): void {
    this.loggedIn = status;
  }

  get getLoginStatus(): boolean {
    return this.loggedIn;
  }

  get getRole(): string {
    return this.role;
  }

  setRole(role: string): void {
    this.role = role;
    localStorage.setItem('role', role);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.loggedIn = true;
  }

  logout(): void {
    this.loggedIn = false;
    this.role = '';
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}