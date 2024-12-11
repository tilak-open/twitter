import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { FollowService } from '../../services/follow.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  posts: WritableSignal<any[]> = signal([]); // Signal to hold post data
  tweetControl = new FormControl('', Validators.required); // FormControl for input
  followService = inject(FollowService);
  loginService = inject(LoginService);
  snackBar = inject(MatSnackBar);
  http = inject(HttpClient);

  constructor() {
    // Watch for changes in followedUsers and fetch posts dynamically
    effect(() => {
      this.fetchFollowedUserPosts();
    });
  }


  // Fetch posts of followed users
  private fetchFollowedUserPosts() {
    const currentUser = this.loginService.getCurrentUserDetails();
    if (!currentUser) return;

    const followedUsers = this.followService.followedUsers();

    // Fetch all posts and filter based on followed users
    this.http.get<any[]>('http://localhost:3000/posts').subscribe({
      next: (allPosts) => {
        const filteredPosts = allPosts.filter((post) =>
          followedUsers.has(post.username)
        );
        this.posts.set(filteredPosts);
      },
      error: (err) => {
        this.snackBar.open('Failed to load posts!', 'Close', { duration: 3000 });
        console.error(err);
      },
    });
  }

  // Add a new tweet
  addPost() {
    if (this.tweetControl.invalid) {
      this.snackBar.open('Please write something to tweet!', 'Close', { duration: 2000 });
      return;
    }

    const currentUser = this.loginService.getCurrentUserDetails();
    if (!currentUser) return;

    const newPost = {
      username: currentUser.name,
      handle: currentUser.username || '@user',
      date: new Date().toLocaleDateString(),
      content: this.tweetControl.value,
      likes: 0,
      picture: currentUser.picture || 'assets/user.png',
    };
    this.posts.update((currentPosts) => [newPost, ...currentPosts]);
    this.snackBar.open('Tweet added successfully!', 'Close', { duration: 2000 });
    this.tweetControl.reset();
  }
}
