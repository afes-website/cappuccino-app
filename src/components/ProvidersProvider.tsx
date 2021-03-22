import React from "react";
import { ThemeProvider } from "@material-ui/core";
import { ThemeContextProvider, useTheme } from "@/libs/themeMode";
import { TitleContextProvider } from "@/libs/title";
import { useHistory } from "react-router-dom";

export const CustomThemeProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const [theme, setThemeMode] = useTheme();

  return (
    <ThemeContextProvider value={{ setThemeMode }}>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </ThemeContextProvider>
  );
};

const TITLE_SUFFIX = "73rd Afes Manage App";
const TOP_TITLE = "73rd Afes Manage App";

export const CustomTitleProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
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
    <TitleContextProvider value={titleState}>
      {props.children}
    </TitleContextProvider>
  );
};

const ProvidersProvider: React.FC = (props) => (
  <CustomThemeProvider>
    <CustomTitleProvider>{props.children}</CustomTitleProvider>
  </CustomThemeProvider>
);

export default ProvidersProvider;
