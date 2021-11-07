import { AspidaClient } from "aspida";
import { AxiosRequestConfig } from "axios";
import { AuthDispatch, AuthState } from "hooks/auth/@types";
import createCtx from "libs/createCtx";

const [useAuthState, AuthStateContextProvider] = createCtx<AuthState>();
const [useAuthDispatch, AuthDispatchContextProvider] =
  createCtx<AuthDispatch>();
const [useAspidaClient, AspidaClientContextProvider] =
  createCtx<AspidaClient<AxiosRequestConfig>>();

export {
  useAuthState,
  useAuthDispatch,
  useAspidaClient,
  AuthStateContextProvider,
  AuthDispatchContextProvider,
  AspidaClientContextProvider,
};
