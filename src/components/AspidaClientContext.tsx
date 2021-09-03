import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { History, LocationState } from "history";
import { AspidaClient } from "aspida";
import aspidaClient from "@aspida/axios";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import createCtx from "libs/createCtx";
import isAxiosError from "libs/isAxiosError";
import routes from "libs/routes";

const [useAspidaClient, AspidaClientContextProvider] = createCtx<
  AspidaClient<AxiosRequestConfig>
>();

interface Props {
  history: History<LocationState>;
  config?: AxiosRequestConfig | undefined;
}

const AspidaClientContext: React.VFC<PropsWithChildren<Props>> = ({
  history,
  children,
  config,
}) => {
  const axiosInstance = useRef<AxiosInstance>(axios.create());
  const [aspida, setAspida] = useState<AspidaClient<AxiosRequestConfig>>(
    aspidaClient(axiosInstance.current, config)
  );

  useEffect(() => {
    axiosInstance.current.interceptors.response.use(undefined, (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        history.push(routes.Login.route.create({}));
        return false;
      }
      return error;
    });
    setAspida(aspidaClient(axiosInstance.current, config));
  }, [config, history]);

  return (
    <AspidaClientContextProvider value={aspida}>
      {children}
    </AspidaClientContextProvider>
  );
};

export { useAspidaClient };

export default AspidaClientContext;
