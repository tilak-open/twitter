import { Component, signal, WritableSignal, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { User } from '../../interface/interface';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-follow-bar',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './follow-bar.component.html',
  styleUrls: ['./follow-bar.component.css']
})
export class FollowBarComponent implements OnInit {
  users: WritableSignal<User[]> = signal([]); // All users
  followedUsers: WritableSignal<Set<string>> = signal(new Set()); // Followed users
  loggedInUserId: string = uuidv4(); // Simulated logged-in user UUID
  loginService = inject(LoginService)

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const currentUser = this.loginService.getCurrentUserDetails();
  
    if (currentUser) {
      this.loggedInUserId = currentUser.id;
  
      this.http.get<User[]>('http://localhost:3000/users').subscribe({
        next: (data) => {
          const filteredUsers = data.filter(user => user.id !== this.loggedInUserId);
          this.users.set(filteredUsers);
        },
        error: (err) => console.error('Error fetching users:', err),
      });
    }
  }
  

  // Toggle follow/unfollow
  toggleFollow(userId: string) {
    const currentFollowed = new Set(this.followedUsers());
    if (currentFollowed.has(userId)) {
      currentFollowed.delete(userId); // Unfollow
    } else {
      currentFollowed.add(userId); // Follow
    }
    this.followedUsers.set(currentFollowed);
  }

  // Check if the user is followed
  isFollowing(userId: string): boolean {
    return this.followedUsers().has(userId);
  }
}
