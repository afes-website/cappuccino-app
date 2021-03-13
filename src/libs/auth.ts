import api, { UserInfo } from "@afes-website/docs";
import axios from "@aspida/axios";
import { createContext, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import routes from "@/libs/routes";
import isAxiosError from "@/libs/isAxiosError";
import {
  faUser,
  faUserCog,
  faUserShield,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

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

  constructor(_on_change_hook?: () => void) {
    this.on_change_hook = _on_change_hook;
    if (axios().baseURL) this.init();
  }

  private async init(): Promise<void> {
    this.load_all_users();
    this.load_current_user_id();
    await this.update_all_users();
    this.reload_current_user();
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
    if (this.on_change_hook) this.on_change_hook();
  }

  remove_user(user_id: string): void {
    delete this.all_users[user_id];
    this.save_all_users();
    this.reload_current_user();
    if (this.on_change_hook) this.on_change_hook();
  }

  private static async update_user_info(
    data: StorageUserInfo
  ): Promise<StorageUserInfo | undefined> {
    try {
      const ret = await api(axios()).auth.user.$get({
        headers: { Authorization: "bearer " + data.token },
      });
      return { ...ret, token: data.token };
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) return undefined;
      else return data;
    }
  }

  async update_user(user_id: string): Promise<void> {
    if (user_id in this.all_users) return;
    const data = await Auth.update_user_info(this.all_users[user_id]);
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
          const ret = await Auth.update_user_info(this.all_users[user_id]);
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
    if (
      this.current_user_id === null ||
      !(this.current_user_id in this.all_users)
    ) {
      this.current_user_id = Object.keys(this.all_users)[0] || null;
      this.save_current_user_id();
    }
  }

  switch_user(user_id: string): void {
    if (user_id in this.all_users) {
      this.current_user_id = user_id;
      this.save_current_user_id();
    }
    if (this.on_change_hook) this.on_change_hook();
  }

  on_change(hook: () => void): void {
    this.on_change_hook = hook;
  }
}

export const AuthContext = createContext<{ val: Auth }>({
  val: new Auth(),
});

export const get_user_icon = (
  account: StorageUserInfo | null
): IconDefinition => {
  if (account?.permissions.admin) return faUserShield;
  if (account?.permissions.general) return faUserCog;
  if (account?.permissions.exhibition) return faUser;
  return faUser;
};

/**
 * 指定された権限（の少なくとも1つ）があるか確認する
 * @param _permission 権限の種類文字列もしくはその配列
 * @param auth AuthContext で得られる Auth オブジェクト
 * @return 指定された権限を持っているかどうか
 */
export const verifyPermission = (
  _permission:
    | keyof StorageUserInfo["permissions"]
    | (keyof StorageUserInfo["permissions"])[],
  auth: Auth
): boolean => {
  const perm_arr = !_permission
    ? []
    : Array.isArray(_permission)
    ? _permission
    : [_permission];
  const current_user = auth.get_current_user();

  if (!current_user) return false;
  return perm_arr.some((_perm) => current_user.permissions[_perm]);
};

/**
 * 指定された権限（の少なくとも1つ）があるか確認し、なければ 403 ページにリダイレクトする
 * @param _permission 権限の種類文字列もしくはその配列
 */
export const useVerifyPermission = (
  _permission:
    | keyof StorageUserInfo["permissions"]
    | (keyof StorageUserInfo["permissions"])[]
): void => {
  const history = useHistory();
  const auth = useContext(AuthContext).val;
  useEffect(() => {
    if (!verifyPermission(_permission, auth)) {
      history.replace(routes.Forbidden.route.create({}));
    }
  }, [_permission, auth, history]);
};
