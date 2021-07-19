import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { Theme, useMediaQuery, useTheme } from "@material-ui/core";
import TypesafeRouter from "components/TypesafeRouter";
import ProvidersProvider from "components/ProvidersProvider";
import MainLayout from "layouts/Main";
import TabletLayout from "layouts/Tablet";
import NotFound from "pages/NotFound";
import { createBrowserHistory } from "history";
import useAuthProvideValue from "libs/auth/useAuthProvideValue";
import {
  AuthStateContextProvider,
  AuthDispatchContextProvider,
} from "libs/auth/useAuth";
import routes from "libs/routes";

const App: React.VFC = () => {
  const [history] = useState(createBrowserHistory());
  const [authState, authDispatch, ready] = useAuthProvideValue();

  const redirect_to_login = () => {
    if (
      ready &&
      !authState.currentUserId &&
      ![routes.Login.route.create({}), routes.Terms.route.create({})].includes(
        history.location.pathname
      )
    ) {
      history.push(routes.Login.route.create({}));
    }
  };
  React.useEffect(redirect_to_login, [authState.currentUserId, history, ready]);
  React.useEffect(() => {
    return history.listen(redirect_to_login);
  });

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return (
    <AuthStateContextProvider value={authState}>
      <AuthDispatchContextProvider value={authDispatch}>
        <TypesafeRouter
          routes={routes}
          history={history}
          layout={LayoutWithProviders}
          fallback={NotFound}
        />
      </AuthDispatchContextProvider>
    </AuthStateContextProvider>
  );
};

const LayoutWithProviders: React.VFC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const theme = useTheme<Theme>();
  const isTablet = useMediaQuery(theme.breakpoints.up("sm"));

  const Layout = useMemo(() => (isTablet ? TabletLayout : MainLayout), [
    isTablet,
  ]);

  return (
    <ProvidersProvider>
      <Layout>{children}</Layout>
    </ProvidersProvider>
  );
};

export default App;

const handleResize = () => {
  const height = window.innerHeight;
  document.documentElement.style.setProperty("--100vh", `${height}px`);
};
