
export interface User {
  id: string;
  name: string;
  gender: string;
  email: string;
  username: string;
  password: string;
  likedPosts?: string[];
  picture: string | null;
}