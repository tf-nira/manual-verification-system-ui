import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
 
  constructor(private router: Router) {}

  canActivate(): boolean {
    console.log('AuthGuard: canActivate called');
   
    // Check both localStorage and sessionStorage
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const sessionActive = sessionStorage.getItem('sessionActive');
   
    console.log('AuthGuard: Token:', token ? 'exists' : 'missing');
    console.log('AuthGuard: Session:', sessionActive ? 'active' : 'inactive');
   
    // Require both valid token AND active session
    if (token && userId && sessionActive && this.isValidToken(token)) {
      console.log('AuthGuard: Access granted');
      return true;
    } else {
      console.log('AuthGuard: Access denied, redirecting to login');
      
      // Clear session but keep login data for re-authentication
      sessionStorage.removeItem('sessionActive');
      
      this.router.navigate(['/login']);
      return false;
    }
  }

  private isValidToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime && payload.sub;
    } catch (error) {
      return false;
    }
  }
}