import React, { PropsWithChildren, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Theme, ThemeProvider, useTheme } from "@material-ui/core";
import { ThemeContextProvider, useThemeMode } from "libs/themeMode";
import { TitleContextProvider } from "libs/title";

const CustomThemeProvider: React.VFC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [theme, toggleThemeMode] = useThemeMode();

  return (
    <ThemeContextProvider value={{ toggleThemeMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContextProvider>
  );
};

const TITLE_SUFFIX = "CAPPUCCINO";
const TOP_TITLE = "CAPPUCCINO";

const CustomTitleProvider: React.VFC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const history = useHistory();
  const [titleState, _setTitleState] = React.useState({
    title: "",
    _setTitle,
  });

  function _setTitle(_new_title: string) {
    _setTitleState((old) => ({ ...old, title: _new_title }));
    document.title = _new_title + " - " + TITLE_SUFFIX;
    if (_new_title === "" || history.location.pathname === "/")
      document.title = TOP_TITLE;
  }

  return (
    <TitleContextProvider value={titleState}>{children}</TitleContextProvider>
  );
};

const SyncBackgroundColor: React.VFC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const theme = useTheme<Theme>();

  useEffect(() => {
    document.body.style.background = theme.palette.background.default;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme.palette.background.default);
  }, [theme.palette.background.default, theme.palette.type]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

const ScrollTop: React.VFC<PropsWithChildren<unknown>> = ({ children }) => {
  const history = useHistory();

  useEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [history.location]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

const LayoutWrapper: React.VFC<PropsWithChildren<unknown>> = ({ children }) => (
  <CustomThemeProvider>
    <CustomTitleProvider>
      <SyncBackgroundColor>
        <ScrollTop>{children}</ScrollTop>
      </SyncBackgroundColor>
    </CustomTitleProvider>
  </CustomThemeProvider>
);

export default LayoutWrapper;
