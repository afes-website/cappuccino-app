import createCtx from "libs/createCtx";
import { AuthDispatch, AuthState } from "libs/auth/@types";

const [useAuthState, AuthStateContextProvider] = createCtx<AuthState>();
const [
  useAuthDispatch,
  AuthDispatchContextProvider,
] = createCtx<AuthDispatch>();

export {
  useAuthState,
  useAuthDispatch,
  AuthStateContextProvider,
  AuthDispatchContextProvider,
};
