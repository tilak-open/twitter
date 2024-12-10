import { Component } from '@angular/core';
import { SidenavComponent } from "../sidenav/sidenav.component";
import { FollowBarComponent } from "../follow-bar/follow-bar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [SidenavComponent, RouterOutlet, FollowBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
