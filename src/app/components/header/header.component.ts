import { Component, Input, effect, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  router = inject(Router)
  http = inject(HttpClient);
  snackBar = inject(MatSnackBar);
  loginService = inject(LoginService)
  tweetControl = new FormControl('', [Validators.required, Validators.maxLength(280)]);

  posts = signal<any[]>([]);
  usersToFollow = signal<any[]>([]); // Signal to store filtered users


  constructor() {
    // Effect to fetch posts when the component initializes
    effect(() => {
      this.fetchPosts();
      this.fetchUsersToFollow();
    });
  }

  private fetchUsersToFollow() {
    const currentUser = this.loginService.getCurrentUserDetails();

    if (!currentUser) {
      return;
    }

    this.http.get<any[]>('http://localhost:3000/users').subscribe(
      (response) => {
        const filteredUsers = response.filter(
          (user) => user.username !== currentUser.username // Exclude the logged-in user
        );
        this.usersToFollow.set(filteredUsers); // Update the usersToFollow signal
      },
      (error) => {
        this.snackBar.open('Failed to load users to follow!', 'Close', { duration: 3000 });
        console.error(error);
      }
    );
  }



  addPost() {
    if (this.tweetControl.invalid) {
      this.snackBar.open('Please enter valid content for your tweet!', 'Close', { duration: 3000 });
      return;
    }
    const userDetails = this.loginService.getCurrentUserDetails();

    if (!userDetails) {
      this.snackBar.open('You need to log in to post!', 'Close', { duration: 3000 });
      return;
    }
    
    const newPost = {
      picture: userDetails.picture,
      username: userDetails.name,
      handle: `@${userDetails.username}`,
      date: 'Just now',
      content: this.tweetControl.value,
      comments: 0,
      likes: 0,
    };

    // Send new post to JSON server
    this.http.post('http://localhost:3000/posts', newPost).subscribe(
      (response: any) => {
        this.snackBar.open('Tweet added successfully!', 'Close', {
          duration: 3000,
        });
  
        // Update the posts signal by adding the new post to the top
        this.posts.update((currentPosts) => [response, ...currentPosts]);
        this.tweetControl.reset(); // Reset the form control
      },
      (error) => {
        this.snackBar.open('Failed to add the tweet. Please try again!', 'Close', {
          duration: 3000,
        });
        console.error(error);
      }
    );
  }

  // Fetch posts from JSON server
  private fetchPosts() {
    this.http.get<any[]>('http://localhost:3000/posts').subscribe(
      (response) => {
        // Update the posts signal with data from the server
        this.posts.set(response.reverse());
      },
      (error) => {
        this.snackBar.open('Failed to load posts. Please try again!', 'Close', {
          duration: 3000,
        });
        console.error(error);
      }
    );
  }

  
}
