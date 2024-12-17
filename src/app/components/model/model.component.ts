import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-model',
  imports: [MatDialogModule,MatButtonModule,MatCardModule],
  templateUrl: './model.component.html',
  styleUrl: './model.component.css'
})
export class ModelComponent {
  private router = inject(Router)

  close(){
    this.router.navigate(['login'])
  }
}
