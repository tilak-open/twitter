import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { FollowService } from '../../services/follow.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatInputModule, ReactiveFormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  posts: WritableSignal<any[]> = signal([]); // Signal to hold post data
  likedPosts = signal<Set<string>>(new Set()); // Signal to track liked post IDs
  tweetControl = new FormControl('', Validators.required); // FormControl for input
  followService = inject(FollowService);
  loginService = inject(LoginService);
  snackBar = inject(MatSnackBar);
  http = inject(HttpClient);
  userProfilePic: string | undefined; // Property to hold the user's profile picture


  constructor() {
    effect(() => {
      this.fetchFollowedUserPosts();
      this.setUserProfilePic();
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
          followedUsers.has(post.username) || post.username === currentUser.name
        );
        this.posts.set(filteredPosts);
      },
      error: (err) => {
        this.snackBar.open('Failed to load posts!', 'Close', { duration: 3000 });
        console.error(err);
      },
    });
  }

  private setUserProfilePic() {
    const currentUser  = this.loginService.getCurrentUserDetails();
    this.userProfilePic = currentUser ?.picture || 'assets/user.png'; // Fallback to default image
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
      id: uuidv4(),
      username: currentUser.name,
      handle: currentUser.username || '@user',
      date: new Date().toLocaleDateString(),
      content: this.tweetControl.value,
      likes: 0,
      picture: currentUser.picture || 'assets/user.png',
    };
  
    // Add the new post locally and to the server
    this.http.post('http://localhost:3000/posts', newPost).subscribe({
      next: () => {
        this.posts.update((currentPosts) => [newPost, ...currentPosts]);
        this.snackBar.open('Tweet added successfully!', 'Close', { duration: 2000 });
        this.tweetControl.reset();
      },
      error: (err) => {
        console.error('Failed to add post:', err);
        this.snackBar.open('Failed to add tweet!', 'Close', { duration: 2000 });
      },
    });
  }

  likePost(post: any) {
    const currentUser = this.loginService.getCurrentUserDetails();
    // Check if the user has already liked this post
    if (currentUser?.likedPosts?.includes(post.id)) {
      this.snackBar.open('You have already liked this post!', 'Close', { duration: 2000 });
      return;
    }
    // Update likes in the post
    const updatedPost = { ...post, likes: post.likes + 1 };
    // Send the updated post to the server
    this.http.put(`http://localhost:3000/posts/${post.id}`, updatedPost).subscribe({
      next: () => {
        // Add post ID to user's likedPosts array
        this.loginService.updateLikedPosts(post.id);
        // Update the local signal
        this.posts.update((currentPosts) =>
          currentPosts.map((p) => (p.id === post.id ? updatedPost : p))
        );
        this.snackBar.open('Post liked!', 'Close', { duration: 2000 });
      },
      error: (err) => {
        console.error('Failed to like post:', err);
        this.snackBar.open('Failed to like post!', 'Close', { duration: 2000 });
      },
    });
  }
  
}
