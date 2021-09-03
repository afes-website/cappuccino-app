import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Theme, useMediaQuery, useTheme } from "@material-ui/core";
import TypesafeRouter from "components/TypesafeRouter";
import LayoutWrapper from "components/LayoutWrapper";
import MainLayout from "layouts/Main";
import TabletLayout from "layouts/Tablet";
import NotFound from "pages/NotFound";
import { createBrowserHistory } from "history";
import routes from "libs/routes";
import AspidaClientContext from "components/AspidaClientContext";
import AuthContext from "components/AuthContext";

const App: React.VFC = () => {
  const [history] = useState(createBrowserHistory());

  const onAuthUpdate = useCallback(
    (authState) => {
      if (
        !authState.currentUserId &&
        ![
          routes.Login.route.create({}),
          routes.Terms.route.create({}),
        ].includes(history.location.pathname)
      ) {
        history.push(routes.Login.route.create({}));
      }
    },
    [history]
  );

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
    <AspidaClientContext history={history}>
      <AuthContext updateCallback={onAuthUpdate}>
        <TypesafeRouter
          routes={routes}
          history={history}
          layout={LayoutWithProviders}
          fallback={NotFound}
        />
      </AuthContext>
    </AspidaClientContext>
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
    <LayoutWrapper>
      <Layout>{children}</Layout>
    </LayoutWrapper>
  );
};

export default App;

const handleResize = () => {
  const height = window.innerHeight;
  document.documentElement.style.setProperty("--100vh", `${height}px`);
};
