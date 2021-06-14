import React, { PropsWithChildren } from "react";
import { ThemeProvider } from "@material-ui/core";
import { ThemeContextProvider, useTheme } from "libs/themeMode";
import { TitleContextProvider } from "libs/title";
import { useHistory } from "react-router-dom";

export const CustomThemeProvider: React.VFC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [theme, toggleThemeMode] = useTheme();

  return (
    <ThemeContextProvider value={{ toggleThemeMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContextProvider>
  );
};

const TITLE_SUFFIX = "CAPPUCCINO";
const TOP_TITLE = "CAPPUCCINO";

export const CustomTitleProvider: React.VFC<PropsWithChildren<unknown>> = ({
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

const ProvidersProvider: React.VFC<PropsWithChildren<unknown>> = ({
  children,
}) => (
  <CustomThemeProvider>
    <CustomTitleProvider>{children}</CustomTitleProvider>
  </CustomThemeProvider>
);

export default ProvidersProvider;
