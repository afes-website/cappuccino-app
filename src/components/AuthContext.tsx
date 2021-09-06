import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import {
  AuthDispatchContextProvider,
  AuthStateContextProvider,
  AspidaClientContextProvider,
} from "libs/auth/useAuth";
import {
  AuthDispatch,
  AuthState,
  StorageUserInfo,
  StorageUsers,
} from "libs/auth/@types";
import isAxiosError from "libs/isAxiosError";
import routes from "libs/routes";
import api from "@afes-website/docs";
import axios, { AxiosRequestConfig } from "axios";
import { AspidaClient } from "aspida";
import aspidaClient from "@aspida/axios";

const ls_key_users = "users";
const ls_key_current_user = "current_user";

interface AuthContextProps {
  updateCallback: (authState: AuthState) => void;
}

const AuthContext: React.VFC<PropsWithChildren<AuthContextProps>> = ({
  updateCallback,
  children,
}) => {
  const history = useHistory();

  const [allUsers, setAllUsers] = useState<StorageUsers>(
    JSON.parse(localStorage.getItem(ls_key_users) ?? "{}")
  );
  const [currentUserId, _setCurrentUserId] = useState<string | null>(
    localStorage.getItem(ls_key_current_user) || null
  );
  // setCurrentUserId() is defined after _generateAspidaClient()

  const [aspida, setAspida] = useState<AspidaClient<AxiosRequestConfig>>(
    aspidaClient()
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

  /**
   * 401 check 付き aspida client を再生成する
   */
  const _generateAspidaClient = useCallback(
    (userId: string | null) => {
      const axiosInstance = axios.create();
      axiosInstance.interceptors.response.use(undefined, (error: unknown) => {
        if (isAxiosError(error) && error.response?.status === 401) {
          if (userId)
            setAllUsers((prev) => {
              const { [userId]: _, ...next } = prev;
              return next;
            });
          history.push(routes.Login.route.create({}), { id: userId });
          return false;
        }
        return error;
      });
      setAspida(aspidaClient(axiosInstance));
    },
    [history]
  );

  const setCurrentUserId = useCallback<React.Dispatch<string | null>>(
    (value) => {
      _setCurrentUserId(value);
      _generateAspidaClient(value);
    },
    [_generateAspidaClient]
  );

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
      const newUserId: string | null = Object.keys(allUsers)[0] ?? null;
      setCurrentUserId(newUserId);
    }
  }, [allUsers, currentUserId, setCurrentUserId]);

  const _updateUserInfo = useCallback(
    async (data: StorageUserInfo): Promise<StorageUserInfo | null> => {
      try {
        const user = await api(aspida).auth.me.$get({
          headers: { Authorization: `bearer ${data.token}` },
        });
        return { ...user, token: data.token };
      } catch (e) {
        if (isAxiosError(e) && e.response?.status === 401) return null;
        else return data;
      }
    },
    [aspida]
  );

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

  // ======== dispatch functions ========

  /**
   * 指定された token に紐づいている user を登録する
   * @param token 登録したい user の JWT
   */
  const registerUser = useCallback(
    async (token: string) => {
      const user = await api(aspida).auth.me.$get({
        headers: { Authorization: `bearer ${token}` },
      });
      setAllUsers((prev) => {
        const { [user.id]: _, ...users } = prev;
        return { [user.id]: { ...user, token }, ...users };
      });
      setCurrentUserId(user.id);
    },
    [aspida, setCurrentUserId]
  );

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
  }, [_updateUserInfo, allUsers, removeUser]);

  /**
   * 現在の user を指定された id の user に切り替える
   * @param userId 切り替えたい user の id
   */
  const switchCurrentUser = useCallback(
    (userId: string): void => {
      if (userId in allUsers) {
        setCurrentUserId(userId);
        if (currentUserId) {
          setAllUsers((prev) => {
            const { [currentUserId]: currentUser, ...otherUsers } = prev;
            return {
              [currentUserId]: currentUser,
              ...otherUsers,
            };
          });
        }
      }
    },
    [allUsers, currentUserId, setCurrentUserId]
  );

  // ======== provide dispatch value ========

  const authDispatch: AuthDispatch = useMemo(
    () => ({
      registerUser,
      removeUser,
      updateAllUsers,
      switchCurrentUser,
    }),
    [registerUser, removeUser, switchCurrentUser, updateAllUsers]
  );

  return (
    <AuthStateContextProvider value={authState}>
      <AuthDispatchContextProvider value={authDispatch}>
        <AspidaClientContextProvider value={aspida}>
          {children}
        </AspidaClientContextProvider>
      </AuthDispatchContextProvider>
    </AuthStateContextProvider>
  );
};

export default AuthContext;
