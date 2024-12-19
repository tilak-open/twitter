import { Component, signal, WritableSignal, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interface/interface';
import { LoginService } from '../../services/login.service';
import { FollowService } from '../../services/follow.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-suggestion',
  imports: [CommonModule],
  templateUrl: './suggestion.component.html',
  styleUrl: './suggestion.component.css'
})

export class SuggestionComponent implements OnInit {
  users: WritableSignal<User[]> = signal([]); // All users
  followedUsers: WritableSignal<Set<string>> = signal(new Set()); // Followed users
  loginService = inject(LoginService);
  http = inject(HttpClient);
  followService = inject(FollowService);
 
 
  ngOnInit() {
    this.fetchUsers()
  }
  fetchUsers() {
    const currentUser = this.loginService.getCurrentUserDetails();
    if (currentUser) {
      this.http.get<User[]>('http://localhost:3000/users').subscribe({
        next: (data) => {
          const filteredUsers = data.filter(user => user.id !== currentUser.id);
          this.users.set(filteredUsers);
        },
        error: (err) => console.error('Error fetching users:', err),
      });
    }
  } 
  // Toggle follow/unfollow
  toggleFollow(userId: string) {
    this.followService.toggleFollow(userId);
  }
 }
 