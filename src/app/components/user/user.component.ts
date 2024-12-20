import { Component, inject } from '@angular/core';
import { User } from '../../interface/interface';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  user: User | undefined;
  private loginService = inject(LoginService);

  ngOnInit() {
    // Fetch the logged-in user details
    this.user = this.loginService.getCurrentUserDetails();
  }
}
