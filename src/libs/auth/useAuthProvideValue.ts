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

/**
 * 認証管理カスタムフック
 * @param callbackFn 認証情報の変更コールバック関数
 * @return [authState, authDispatch]
 */
const useAuthProvideValue = (
  callbackFn?: () => void
): [AuthState, AuthDispatch] => {
  const [allUsers, setAllUsers] = useState<StorageUsers>(
    JSON.parse(localStorage.getItem(ls_key_users) ?? "{}")
  );
  const [currentUserId, setCurrentUserId] = useState<string | null>(
    localStorage.getItem(ls_key_current_user) || null
  );

  useEffect(() => {
    updateAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ======== inner functions ========

  const _saveAllUsers = useCallback(
    () => localStorage.setItem(ls_key_users, JSON.stringify(allUsers)),
    [allUsers]
  );

  const _saveCurrentUserId = useCallback(
    () => localStorage.setItem(ls_key_current_user, currentUserId ?? ""),
    [currentUserId]
  );

  const _reloadCurrentUser = useCallback(() => {
    if (currentUserId === null || !(currentUserId in allUsers)) {
      setCurrentUserId(Object.keys(allUsers)[0] ?? null);
    }
  }, [allUsers, currentUserId]);

  // allUsers 監視
  useEffect(() => {
    _saveAllUsers();
    _reloadCurrentUser();
    if (callbackFn) callbackFn();
  }, [_saveAllUsers, _reloadCurrentUser, callbackFn, allUsers]);

  // currentUserId 監視
  useEffect(() => {
    _saveCurrentUserId();
    if (callbackFn) callbackFn();
  }, [_saveCurrentUserId, callbackFn, currentUserId]);

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
  const registerUser = useCallback(async (token: string) => {
    const user = await api(aspida()).auth.user.$get({
      headers: { Authorization: `bearer ${token}` },
    });
    setAllUsers((prev) => ({ ...prev, [user.id]: { ...user, token } }));
    setCurrentUserId(user.id);
  }, []);

  /**
   * 指定された id の user を削除する
   * @param userId 削除したい user の id
   */
  const removeUser = useCallback((userId: string): void => {
    setAllUsers((prev) => {
      const { [userId]: _, ...next } = prev;
      return next;
    });
  }, []);

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
  }, [allUsers, removeUser]);

  /**
   * 現在の user を指定された id の user に切り替える
   * @param userId 切り替えたい user の id
   */
  const switchCurrentUser = useCallback(
    (userId: string): void => {
      if (userId in allUsers) {
        setCurrentUserId(userId);
      }
    },
    [allUsers]
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
