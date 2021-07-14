import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import TypesafeRouter from "components/TypesafeRouter";
import routes from "libs/routes";
import { createBrowserHistory } from "history";
import NotFound from "pages/NotFound";
import MainLayout from "layouts/Main";
import TabletLayout from "layouts/Tablet";
import Auth, { AuthContext } from "libs/auth";
import UAParser from "ua-parser-js";
import ProvidersProvider from "components/ProvidersProvider";

const App: React.VFC = () => {
  const [history] = useState(createBrowserHistory());
  const [provideVal, setProvideVal] = React.useState(() => ({
    val: new Auth(),
  }));
  React.useEffect(() => {
    provideVal.val.on_change(() => {
      setProvideVal((old) => ({ ...old }));
    });
  }, [provideVal.val]);

  const redirect_to_login = () => {
    if (
      !provideVal.val.get_current_user_id() &&
      ![routes.Login.route.create({}), routes.Terms.route.create({})].includes(
        history.location.pathname
      )
    ) {
      history.push(routes.Login.route.create({}));
    }
  };
  React.useEffect(redirect_to_login, [history, provideVal]);
  React.useEffect(() => {
    return history.listen(redirect_to_login);
  });

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <AuthContext.Provider value={provideVal}>
      <TypesafeRouter
        routes={routes}
        history={history}
        layout={LayoutWithProviders}
        fallback={NotFound}
      />
    </AuthContext.Provider>
  );
};

const LayoutWithProviders: React.VFC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const Layout = useMemo(() => {
    const parser = new UAParser(navigator.userAgent);
    return parser.getDevice().type === "tablet" ? TabletLayout : MainLayout;
  }, []);

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
