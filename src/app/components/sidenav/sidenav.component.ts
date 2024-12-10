import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [MatIconModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  private LoginService = inject(LoginService)
  private router = inject(Router);


  logout(): void {
    this.LoginService.logout();
    this.router.navigate(['/login']);
  }
  

}
