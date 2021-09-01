import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AuthStateContextProvider,
  AuthDispatchContextProvider,
} from "libs/auth/useAuth";
import { AuthState, StorageUserInfo, StorageUsers } from "libs/auth/@types";
import isAxiosError from "libs/isAxiosError";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";

const ls_key_users = "users";
const ls_key_current_user = "current_user";

interface AuthContextProps {
  updateCallback: (authState: AuthState) => void;
}

const AuthContext: React.VFC<PropsWithChildren<AuthContextProps>> = ({
  updateCallback,
  children,
}) => {
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

  // ======== provide state value ========

  const authState = useMemo(
    () => ({
      allUsers,
      currentUserId,
      currentUser:
        currentUserId && currentUserId in allUsers
          ? allUsers[currentUserId]
          : null,
    }),
    [allUsers, currentUserId]
  );

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
    if (updateCallback) updateCallback(authState);
  }, [_saveAllUsers, _reloadCurrentUser, updateCallback, allUsers, authState]);

  // currentUserId 監視
  useEffect(() => {
    _saveCurrentUserId();
    if (updateCallback) updateCallback(authState);
  }, [_saveCurrentUserId, authState, updateCallback, currentUserId]);

  const _updateUserInfo = async (
    data: StorageUserInfo
  ): Promise<StorageUserInfo | null> => {
    try {
      const user = await api(aspida()).auth.me.$get({
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
    const user = await api(aspida()).auth.me.$get({
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

  // ======== provide dispatch value ========

  const authDispatch = useMemo(
    () => ({ registerUser, removeUser, updateAllUsers, switchCurrentUser }),
    [registerUser, removeUser, switchCurrentUser, updateAllUsers]
  );

  return (
    <AuthStateContextProvider value={authState}>
      <AuthDispatchContextProvider value={authDispatch}>
        {children}
      </AuthDispatchContextProvider>
    </AuthStateContextProvider>
  );
};

export default AuthContext;
