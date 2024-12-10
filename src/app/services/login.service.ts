import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interface/interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { v4 as uuidv4 } from 'uuid'; // Import the UUID function

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/users';
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar)

  // Signals to manage the state
  private users = signal<User[]>([]);
  private isLoggedInSignal = signal(false);
  private currentUsername = signal<string | null>(null);

  // Read-only signals for external use
  isLoggedIn = this.isLoggedInSignal.asReadonly();
  username = this.currentUsername.asReadonly();

  constructor() {
    // Fetch users when the service is initialized
    effect(() => {
      this.loadUsers();
    });
  }

  // Load users from the server
  private async loadUsers(): Promise<void> {
    try {
      const users = await this.http.get<User[]>(this.apiUrl).toPromise();
      this.users.set(users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  // Login method using Signals
  login(username: string, password: string): boolean {
    const userExists = this.users().some(
      (user) => user.username === username && user.password === password
    );

    if (userExists) {
      this.setLoggedIn(username);
      return true;
    } else {
      return false;
    }
  }

  // Register method using Signals
  async register(user: User): Promise<boolean> {
    try {
      const existingUser = this.users().some((u) => u.username === user.username);
      if (existingUser) {
        return false; // Username already exists
      }
      user.id = uuidv4(); // Set the UUID for the user

      const newUser = await this.http.post<User>(this.apiUrl, user).toPromise();
      this.users.set([...this.users(), newUser!]); // Update the users signal
      return true;
    } catch (error) {
      console.error('Error registering user:', error);
      return false;
    }
  }
  
  

  // Set login state
  private setLoggedIn(username: string): void {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    this.isLoggedInSignal.set(true);
    this.currentUsername.set(username);
  }

  getCurrentUserDetails(): User | undefined {
    const username = this.currentUsername();
    return this.users().find(user => user.username === username);
  }
  

  // Logout method
  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    this.isLoggedInSignal.set(false);
    this.currentUsername.set(null);
    this.snackBar.open('You are logged out!', 'Close', { duration: 2000 });

  }

}
