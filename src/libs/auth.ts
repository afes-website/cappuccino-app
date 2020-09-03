import api, { UserInfo } from "@afes-website/docs";
import axios from "@aspida/axios";
import JWT from "@/libs/jwt";

const storage_key_users = "users";
const storage_key_current_user = "current_user";

type StorageUsers = { [user_id: string]: StorageUserInfo };

export type StorageUserInfo = {
  token: string;
} & UserInfo;

export function get_users(): StorageUsers {
  const str = localStorage.getItem(storage_key_users);
  if (str === null) {
    save_users({});
    return {};
  }
  return JSON.parse(str);
}

function save_users(data: StorageUsers): void {
  localStorage.setItem(storage_key_users, JSON.stringify(data));
}

function save_user(data: StorageUserInfo): void {
  const all = get_users();
  all[data.id] = data;
  save_users(all);
}

export function get_logged_in_users(): string[] {
  return Object.keys(get_users());
}

export function get_user(user_id: string): StorageUserInfo | undefined {
  return get_users()[user_id];
}

export async function register_user(token: string): Promise<void> {
  const ret = await api(axios()).auth.user.$get({
    headers: { Authorization: "bearer " + token },
  });
  save_user({ ...ret, token });
}

export function logout(user_id: string): void {
  const data = get_users();
  delete data[user_id];
  save_users(data);
  if (Object.values(get_users()).length)
    switch_user(Object.values(get_users())[0].id);
  else switch_user("");
}

async function _update_user(
  data: StorageUserInfo
): Promise<StorageUserInfo | undefined> {
  if (!new JWT(data.token).isValidAt()) return undefined;

  const ret = await api(axios()).auth.user.$get({
    headers: { Authorization: "bearer " + data.token },
  });
  return { ...ret, token: data.token };
}

export async function update_user(user_id: string): Promise<void> {
  const user = get_user(user_id);
  if (user === undefined) return;
  const data = await _update_user(user);
  if (data === undefined) logout(user_id);
  else {
    save_user(data);
    get_current_user_id(); // reassign current_user if selected user was deleted
  }
}

export async function update_users(): Promise<void> {
  save_users(
    Object.fromEntries(
      (
        await Promise.allSettled(
          Object.entries(get_users()).map<
            Promise<[string, StorageUserInfo] | undefined>
          >(async ([key, data]) => {
            try {
              const ret = await _update_user(data);
              if (ret === undefined) return undefined;
              return [key, ret];
            } catch {
              return undefined;
            }
          })
        )
      ).reduce<[string, StorageUserInfo][]>((prev, ret) => {
        if (ret.status === "fulfilled" && ret.value !== undefined) {
          const [key, value] = ret.value;
          if (value !== undefined) prev.push([key, value]);
        }
        return prev;
      }, [])
    )
  );
  get_current_user_id(); // reassign current_user if selected user was deleted
}

function get_current_user_id(): string {
  let current_user = localStorage.getItem(storage_key_current_user);
  if (current_user === null) {
    current_user = Object.keys(get_users())[0] || "";
    localStorage.setItem(storage_key_current_user, current_user);
  }
  return current_user;
}

export function get_current_user(): StorageUserInfo | null {
  const current_user = get_current_user_id();
  if (current_user === "") return null;
  return get_user(current_user) || null;
}

export function switch_user(user_id: string): void {
  if (get_user(user_id))
    localStorage.setItem(storage_key_current_user, user_id);
}
