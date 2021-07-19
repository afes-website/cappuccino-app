import { useCallback, useEffect, useState } from "react";
import {
  AuthDispatch,
  AuthState,
  StorageUserInfo,
  StorageUsers,
} from "libs/auth/@types";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import isAxiosError from "libs/isAxiosError";

const ls_key_users = "users";
const ls_key_current_user = "current_user";

const useAuthProvideValue = (): [AuthState, AuthDispatch] => {
  const [allUsers, setAllUsers] = useState<StorageUsers>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      _loadAllUsers();
      _loadCurrentUserId();
      await updateAllUsers();
      _reloadCurrentUser();
    })();
    // eslint-disable-next-line
  }, []);

  // ======== inner functions ========

  const _loadAllUsers = () =>
    setAllUsers(JSON.parse(localStorage.getItem(ls_key_users) ?? "{}"));

  const _saveAllUsers = useCallback(
    () => localStorage.setItem(ls_key_users, JSON.stringify(allUsers)),
    [allUsers]
  );

  useEffect(_saveAllUsers, [_saveAllUsers, allUsers]);

  const _loadCurrentUserId = () =>
    setCurrentUserId(localStorage.getItem(ls_key_current_user) || null);

  const _saveCurrentUserId = useCallback(
    () => localStorage.setItem(ls_key_current_user, currentUserId ?? ""),
    [currentUserId]
  );

  useEffect(_saveCurrentUserId, [_saveCurrentUserId, currentUserId]);

  const _reloadCurrentUser = useCallback(() => {
    if (currentUserId === null || !(currentUserId in allUsers)) {
      setCurrentUserId(Object.keys(allUsers)[0] ?? null);
      _saveCurrentUserId();
    }
  }, [_saveCurrentUserId, allUsers, currentUserId]);

  useEffect(_reloadCurrentUser, [_reloadCurrentUser, allUsers]);

  const _updateUserInfo = async (
    data: StorageUserInfo
  ): Promise<StorageUserInfo | null> => {
    try {
      const user = await api(aspida()).auth.user.$get({
        headers: { Authorization: `bearer ${data.token}` },
      });
      return { ...user, token: data.token };
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) return null;
      else return data;
    }
  };

  // ======== dispatch functions ========

  /**
   * 指定された token に紐づいている user を登録する
   * @param token 登録したい user の JWT
   */
  const registerUser = useCallback(
    async (token: string) => {
      const user = await api(aspida()).auth.user.$get({
        headers: { Authorization: `bearer ${token}` },
      });
      setAllUsers((prev) => ({ ...prev, [user.id]: { ...user, token } }));
      setCurrentUserId(user.id);
      _saveCurrentUserId();
    },
    [_saveCurrentUserId]
  );

  /**
   * 指定された id の user を削除する
   * @param userId 削除したい user の id
   */
  const removeUser = useCallback(
    (userId: string): void => {
      setAllUsers((prev) => {
        const { [userId]: _, ...next } = prev;
        return next;
      });
      _saveAllUsers();
    },
    [_saveAllUsers]
  );

  /**
   * 全ての user 情報を更新する
   */
  const updateAllUsers = useCallback(async () => {
    await Promise.allSettled(
      Object.keys(allUsers).map(async (userId) => {
        try {
          const user = await _updateUserInfo(allUsers[userId]);
          if (!user) removeUser(userId);
          else setAllUsers((prev) => ({ ...prev, [userId]: user }));
        } catch {
          removeUser(userId);
        }
      })
    );
    _reloadCurrentUser();
  }, [_reloadCurrentUser, allUsers, removeUser]);

  /**
   * 現在の user を指定された id の user に切り替える
   * @param userId 切り替えたい user の id
   */
  const switchCurrentUser = useCallback(
    (userId: string): void => {
      if (userId in allUsers) {
        setCurrentUserId(userId);
        _saveCurrentUserId();
      }
    },
    [_saveCurrentUserId, allUsers]
  );

  return [
    {
      allUsers,
      currentUserId,
      currentUser:
        currentUserId && currentUserId in allUsers
          ? allUsers[currentUserId]
          : null,
    },
    { registerUser, removeUser, updateAllUsers, switchCurrentUser },
  ];
};

export default useAuthProvideValue;
