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
import TitleContext from "@/libs/titleContext";
import { useHistory } from "react-router-dom";

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
      marginBottom: "56px", // bottom Nav
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

const MainLayout: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [titleProvideVal, setTitleProvideVal] = React.useState({
    title: "",
    set: (_title: string) => {
      setTitleProvideVal((old) => ({ ...old, title: _title }));
      document.title = _title + " - " + TITLE_SUFFIX;
      if (_title === "" || history.location.pathname === "/")
        document.title = TOP_TITLE;
    },
  });

  return (
    <ThemeProvider theme={themes.light}>
      <TitleContext.Provider value={titleProvideVal}>
        <Paper className={classes.root} square={true}>
          <div className={classes.topBar}>
            <TopBar title={titleProvideVal.title} />
          </div>
          <main className={classes.main}>{props.children}</main>
          <div className={classes.bottomNav}>
            <BottomNav />
          </div>
        </Paper>
      </TitleContext.Provider>
    </ThemeProvider>
  );
};

const TITLE_SUFFIX = "73rd Afes Manage App";
const TOP_TITLE = "73rd Afes Manage App";

export default MainLayout;
