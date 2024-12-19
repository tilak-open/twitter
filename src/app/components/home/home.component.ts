import { Component } from '@angular/core';
import { SidenavComponent } from "../sidenav/sidenav.component";
import { RouterOutlet } from '@angular/router';
import { SuggestionComponent } from '../suggestion/suggestion.component';

@Component({
  selector: 'app-home',
  imports: [SidenavComponent, RouterOutlet,SuggestionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
