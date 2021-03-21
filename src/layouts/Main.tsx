import React from "react";
import {
  createStyles,
  makeStyles,
  Paper,
  ThemeProvider,
} from "@material-ui/core";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import themes from "@/assets/styles/theme";
import { TitleContextProvider } from "@/libs/title";
import {
  getThemeModeFromLocalStorage,
  setThemeModeToLocalStorage,
  ToggleThemeContextProvider,
} from "@/libs/toggleTheme";
import { useHistory } from "react-router-dom";
import { ThemeType } from "@/libs/toggleTheme";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      minHeight: "100vh",
      height: "max-content",
    },
    topBar: {
      position: "sticky",
      top: 0,
      width: "100%",
      zIndex: 600,
    },
    main: {
      paddingBottom: "56px", // bottom Nav
    },
    bottomNav: {
      position: "fixed",
      bottom: 0,
      width: "100%",
      zIndex: 600,
    },
  })
);

interface Props {
  children: React.ReactNode;
}
const TITLE_SUFFIX = "73rd Afes Manage App";
const TOP_TITLE = "73rd Afes Manage App";

const MainLayout: React.FC<Props> = (props) => {
  const classes = useStyles();
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
    <ToggleThemeProvider>
      <TitleContextProvider value={titleState}>
        <Paper className={classes.root} square={true}>
          <div className={classes.topBar}>
            <TopBar title={titleState.title} />
          </div>
          <main className={classes.main}>{props.children}</main>
          <div className={classes.bottomNav}>
            <BottomNav />
          </div>
        </Paper>
      </TitleContextProvider>
    </ToggleThemeProvider>
  );
};

export default MainLayout;

const ToggleThemeProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const _setTheme = (mode: ThemeType) => {
    _setThemeState((old) => ({ ...old, theme: themes[mode] }));
    setThemeModeToLocalStorage(mode);
  };

  const [themeState, _setThemeState] = React.useState({
    theme: themes[getThemeModeFromLocalStorage() || "light"],
    _setTheme,
  });

  return (
    <ToggleThemeContextProvider value={themeState}>
      <ThemeProvider theme={themeState.theme}>{props.children}</ThemeProvider>
    </ToggleThemeContextProvider>
  );
};
