import api, { UserInfo } from "@afes-website/docs";
import axios from "@aspida/axios";
import JWT from "@/libs/jwt";

const storage_key_users = "users";
const storage_key_current_user = "current_user";

type StorageUsers = { [user_id: string]: StorageUserInfo };

export type StorageUserInfo = {
  token: string;
} & UserInfo;

export default class Auth {
  private all_users: StorageUsers = {};
  private current_user_id: string | null = null;
  private on_change_hook?: () => void;

  constructor() {
    this.load_all_users();
    this.load_current_user_id();
  }

  private load_all_users(): void {
    this.all_users = JSON.parse(
      localStorage.getItem(storage_key_users) || "{}"
    );
  }

  private load_current_user_id(): void {
    const val = localStorage.getItem(storage_key_current_user);
    this.current_user_id = val === "" ? null : val;
  }

  private save_all_users(): void {
    localStorage.setItem(storage_key_users, JSON.stringify(this.all_users));
    this.reload_current_user();
    if (this.on_change_hook) this.on_change_hook();
  }

  private save_current_user_id(): void {
    localStorage.setItem(storage_key_current_user, this.current_user_id || "");
  }

  get_all_users(): StorageUsers {
    return this.all_users;
  }

  get_all_user_ids(): string[] {
    return Object.keys(this.all_users);
  }

  get_user(user_id: string): StorageUserInfo | undefined {
    return this.all_users[user_id];
  }

  get_current_user_id(): string | null {
    this.reload_current_user();
    if (this.on_change_hook) this.on_change_hook();
    return this.current_user_id;
  }

  get_current_user(): StorageUserInfo | null {
    if (this.current_user_id === null) return null;
    return this.all_users[this.current_user_id] || null;
  }

  async register_user(token: string): Promise<void> {
    const ret = await api(axios()).auth.user.$get({
      headers: { Authorization: "bearer " + token },
    });
    this.all_users[ret.id] = {
      ...ret,
      token,
    };
    this.save_all_users();
  }

  remove_user(user_id: string): void {
    delete this.all_users[user_id];
    this.save_all_users();
  }

  private async update_user_info(
    data: StorageUserInfo
  ): Promise<StorageUserInfo | undefined> {
    if (!new JWT(data.token).isValidAt()) return undefined;

    const ret = await api(axios()).auth.user.$get({
      headers: { Authorization: "bearer " + data.token },
    });
    return { ...ret, token: data.token };
  }

  async update_user(user_id: string): Promise<void> {
    if (user_id in this.all_users) return;
    const data = await this.update_user_info(this.all_users[user_id]);
    if (data === undefined) this.remove_user(user_id);
    else {
      this.all_users[user_id] = data;
      this.save_all_users();
    }
  }

  async update_all_users(): Promise<void> {
    await Promise.allSettled(
      Object.keys(this.all_users).map(async (user_id) => {
        try {
          const ret = await this.update_user_info(this.all_users[user_id]);
          if (ret === undefined) delete this.all_users[user_id];
          else this.all_users[user_id] = ret;
        } catch {
          delete this.all_users[user_id];
        }
      })
    );
    this.save_all_users();
  }

  private reload_current_user(): void {
    if (this.current_user_id === null) {
      this.current_user_id = Object.keys(this.all_users)[0] || null;
      this.save_current_user_id();
    }
  }

  switch_user(user_id: string): void {
    if (user_id in this.all_users)
      localStorage.setItem(storage_key_current_user, user_id);
  }

  on_change(hook: () => void): void {
    this.on_change_hook = hook;
  }
}
