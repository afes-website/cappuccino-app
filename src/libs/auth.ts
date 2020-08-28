import api, { UserInfo } from "@afes-website/docs";
import axios from "@aspida/axios";
import JWT from "@/libs/jwt";

const storage_key_users = "users";

type StorageUsers = { [user_id: string]: StorageUserInfo };

type StorageUserInfo = {
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

export function logout(user_id: string): void {
  const data = get_users();
  delete data[user_id];
  save_users(data);
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
  else save_user(user_id, data);
}

export async function update_users(): Promise<void> {
  save_users(
    Object.fromEntries(
      (
        await Promise.allSettled(
          Object.entries(get_users()).map<
            Promise<[string, StorageUserInfo | undefined]>
          >(async ([key, data]) => {
            try {
              return [key, await _update_user(data)];
            } catch {
              return [key, data];
            }
          })
        )
      ).reduce<[string, StorageUserInfo][]>((prev, ret) => {
        if (ret.status === "fulfilled") {
          const [key, value] = ret.value;
          if (value !== undefined) prev.push([key, value]);
        }
        return prev;
      }, [])
    )
  );
}
