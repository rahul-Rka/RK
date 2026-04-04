import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  setRole(role: string) {
    localStorage.setItem('role', role);
  }

  get getRole(): string {
    return localStorage.getItem('role') || '';
  }

  setLoginStatus(status: boolean) {
    localStorage.setItem('isLoggedIn', status ? 'true' : 'false');
  }

  get getLoginStatus(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
  }
}