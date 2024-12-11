import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private loginService = inject(LoginService);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.loginService.isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/login']); 
      return false;
    }
  }
}
