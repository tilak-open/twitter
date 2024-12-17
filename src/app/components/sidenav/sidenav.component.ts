import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModelComponent } from '../model/model.component';

@Component({
  selector: 'app-sidenav',
  imports: [MatIconModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  private loginService = inject(LoginService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  logout(): void {
    const dialogRef = this.dialog.open(ModelComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loginService.logout();
        this.router.navigate(['/login']);
      }
    });
  }


}
