import { UserInfo } from "@afes-website/docs";

export type StorageUsers = { [user_id: string]: StorageUserInfo };

export type StorageUserInfo = {
  token: string;
} & UserInfo;

export interface AuthState {
  allUsers: StorageUsers;
  currentUserId: string | null;
  currentUser: StorageUserInfo | null;
}

export interface AuthDispatch {
  registerUser: (token: string) => Promise<void>;
  removeUser: (userId: string) => void;
  updateAllUsers: () => Promise<void>;
  switchCurrentUser: (userId: string) => void;
}
