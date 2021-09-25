import createCtx from "libs/createCtx";
import { AuthDispatch, AuthState } from "libs/auth/@types";
import { AspidaClient } from "aspida";
import { AxiosRequestConfig } from "axios";

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
