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
import AuthContext from "components/AuthContext";
import { useHistory } from "react-router-dom";

const App: React.VFC = () => {
  const [history] = useState(createBrowserHistory());

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
    <TypesafeRouter
      routes={routes}
      history={history}
      layout={LayoutWithProviders}
      fallback={NotFound}
    />
  );
};

const Auth: React.VFC<PropsWithChildren<unknown>> = ({ children }) => {
  const history = useHistory();

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

  return <AuthContext updateCallback={onAuthUpdate}>{children}</AuthContext>;
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
      <Auth>
        <Layout>{children}</Layout>
      </Auth>
    </LayoutWrapper>
  );
};

export default App;

const handleResize = () => {
  const height = window.innerHeight;
  document.documentElement.style.setProperty("--100vh", `${height}px`);
};
