import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LoginService } from '../../services/login.service';
import { User } from '../../interface/interface';

@Component({
  selector: 'app-profile',
  imports: [MatCardModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | undefined;
  private loginService = inject(LoginService);

  ngOnInit() {
    // Fetch the logged-in user details
    this.user = this.loginService.getCurrentUserDetails();
  }
}
