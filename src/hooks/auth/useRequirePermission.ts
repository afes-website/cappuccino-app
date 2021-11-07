import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { StorageUserInfo } from "hooks/auth/@types";
import { useAuthState } from "hooks/auth/useAuth";
import routes from "libs/routes";

/**
 * 指定された権限（の少なくとも1つ）があるか確認する
 * @param _permission 権限の種類文字列もしくはその配列
 * @param currentUser 現在の user
 * @return 指定された権限を持っているかどうか
 */
export const verifyPermission = (
  _permission:
    | keyof StorageUserInfo["permissions"]
    | (keyof StorageUserInfo["permissions"])[],
  currentUser: StorageUserInfo | null
): boolean => {
  const perm_arr = !_permission
    ? []
    : Array.isArray(_permission)
    ? _permission
    : [_permission];

  if (!currentUser) return false;
  return perm_arr.some((_perm) => currentUser.permissions[_perm]);
};

/**
 * 指定された権限（の少なくとも1つ）があるか確認し、なければ 403 ページにリダイレクトする
 * @param _permission 権限の種類文字列もしくはその配列
 */
export const useRequirePermission = (
  _permission:
    | keyof StorageUserInfo["permissions"]
    | (keyof StorageUserInfo["permissions"])[]
): void => {
  const history = useHistory();
  const authState = useAuthState();
  useEffect(() => {
    if (!verifyPermission(_permission, authState.currentUser)) {
      history.replace(routes.Forbidden.route.create({}));
    }
  }, [_permission, authState.currentUser, history]);
};
