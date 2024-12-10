import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../interface/interface';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isSignIn: boolean = false; // Toggle between Login and Sign In
  loginForm: FormGroup;
  signInForm: FormGroup;
  private fb = inject(FormBuilder)
  private loginService = inject(LoginService)
  private snackBar = inject(MatSnackBar)
  private router = inject(Router)

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.signInForm = this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      picture: [''],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
    
  }

  toggleSignIn() {
    this.isSignIn = !this.isSignIn;
  }

  login() {
    if (this.loginForm.invalid) {
      this.snackBar.open('Please fill out the form correctly.', 'Close', { duration: 3000 });
      return;
    }
    const { username, password } = this.loginForm.value;
    if (this.loginService.login(username, password)) {
      this.snackBar.open('Login successful!', 'Close', { duration: 1000 });
      this.router.navigateByUrl('home');
    } else {
      this.snackBar.open('Invalid credentials', 'Close', { duration: 3000 });
    }
    this.loginForm.reset();
  }

  signIn() {
    if (this.signInForm.invalid) {
      this.snackBar.open('Please fill out the form correctly.', 'Close', { duration: 3000 });
      return;
    }
        // const formData = this.loginForm.value; // Retrieve form values

    const formData: User = this.signInForm.value;
    const fileInput: HTMLInputElement | null = document.querySelector('input[formControlName="picture"]');

    if (fileInput?.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.convertToBase64(file).then((base64String) => {
        const user: User = {
          ...formData,
          picture: base64String, // Set Base64 string to `picture` property
        };
        this.registerUser(user);
      }).catch(() => {
        this.snackBar.open('Error uploading picture.', 'Close', { duration: 3000 });
      });
    } else {
      const user: User = { ...formData, picture: null }; // Handle case with no picture
      this.registerUser(user);
    }
  }

  private registerUser(user: User) {
    this.loginService.register(user).then((success) => {
      if (success) {
        this.snackBar.open('Registration successful!', 'Close', { duration: 3000 });
        this.toggleSignIn();
      } else {
        this.snackBar.open('Username already exists!', 'Close', { duration: 3000 });
      }
    });
    this.signInForm.reset();
  }
  
  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
}
