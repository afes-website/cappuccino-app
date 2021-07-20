import React, { PropsWithChildren } from "react";
import { ThemeProvider } from "@material-ui/core";
import { ThemeContextProvider, useThemeMode } from "libs/themeMode";
import { TitleContextProvider } from "libs/title";
import { useHistory } from "react-router-dom";

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

const LayoutWrapper: React.VFC<PropsWithChildren<unknown>> = ({ children }) => (
  <CustomThemeProvider>
    <CustomTitleProvider>{children}</CustomTitleProvider>
  </CustomThemeProvider>
);

export default LayoutWrapper;
