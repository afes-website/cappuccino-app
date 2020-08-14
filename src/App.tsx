import React, { useState } from "react";
import TypesafeRouter from "@/components/TypesafeRouter";
import routes from "@/libs/routes";
import { createBrowserHistory } from "history";
import {
  createStyles,
  makeStyles,
  Paper,
  ThemeProvider,
} from "@material-ui/core";
import NotFound from "@/pages/NotFound";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import themes from "@/assets/styles/theme";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      height: "100vh",
    },
    bottomNav: {
      position: "fixed",
      bottom: 0,
      width: "100%",
    },
  })
);

const App: React.FunctionComponent = () => {
  const [history] = useState(createBrowserHistory());
  const classes = useStyles();

  return (
    <ThemeProvider theme={themes.light}>
      <Paper className={classes.root}>
        <TopBar title="Manager for Exhibition" isNeedBackButton={false} />
        <TypesafeRouter routes={routes} history={history} fallback={NotFound} />
        <div className={classes.bottomNav}>
          <BottomNav />
        </div>
      </Paper>
    </ThemeProvider>
  );
};

export default App;
