import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FollowService {
  private _followedUsers: WritableSignal<Set<string>> = signal(new Set());

  // Expose followed users as a signal
  followedUsers = this._followedUsers;

  // Toggle follow/unfollow for a user
  toggleFollow(username: string) {
    this._followedUsers.update((users) => {
      const updatedUsers = new Set(users);
      if (updatedUsers.has(username)) {
        updatedUsers.delete(username); // Unfollow
      } else {
        updatedUsers.add(username); // Follow
      }
      return updatedUsers;
    });
  }
}
