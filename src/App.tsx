import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Theme, useMediaQuery, useTheme } from "@material-ui/core";
import MainLayout from "layouts/Main";
import TabletLayout from "layouts/Tablet";
import NotFound from "pages/NotFound";
import AuthContext from "components/AuthContext";
import LayoutWrapper from "components/LayoutWrapper";
import TypesafeRouter from "components/TypesafeRouter";
import routes from "libs/routes";

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

  // easter egg to get successors
  useEffect(() => {
    console.log(
      `%cWe are hiring!
%c
文実ウェブサイト班です。コンソールを覗いていただきありがとうございます。
実は我々は昨年から開発を続けているしがない高3です。
今、ウェブサイト班は深刻な後継技術者不足に悩まされています。
スマホアプリとして紹介したサイトのコンソールを見ているあたり、Web技術に興味があるとお見受けします。
あなたの技術力をぜひ来年以降の文化祭運営に役立てていただきたいのです。
興味のある方は連絡をください。
%c文化祭実行委員会はあなたをお待ちしています！%c
＊問い合わせ先: 総務局 / contact@afes.info
`,
      "font-size: 3em; font-weight: bold; color: red;",
      "",
      "font-weight: bold;",
      ""
    );
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

  const Layout = useMemo(
    () => (isTablet ? TabletLayout : MainLayout),
    [isTablet]
  );

  return (
    <Auth>
      <LayoutWrapper>
        <Layout>{children}</Layout>
      </LayoutWrapper>
    </Auth>
  );
};

export default App;

const handleResize = () => {
  const height = window.innerHeight;
  document.documentElement.style.setProperty("--100vh", `${height}px`);
};
