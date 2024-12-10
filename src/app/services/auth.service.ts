import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = !!this.loginService.getCurrentUserDetails();
    if (!isLoggedIn) {
      this.router.navigate(['/login']); // Redirect to login page if not logged in
    }
    return isLoggedIn;
  }
}
