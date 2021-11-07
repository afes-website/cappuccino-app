import React, { PropsWithChildren } from "react";
import { createStyles, makeStyles, Paper } from "@material-ui/core";
import TopBar from "components/TopBar";
import BottomNav from "components/BottomNav";
import { useTitleContext } from "libs/title";
import { useAuthState } from "hooks/auth/useAuth";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      background: "none",
    },
    topBar: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 600,
    },
    main: {
      boxSizing: "border-box",
      height: "100%",
      minHeight: "var(--100vh)",
      width: "100%",
      paddingTop: "calc(env(safe-area-inset-top) + 56px)",
      paddingBottom: "calc(env(safe-area-inset-bottom) + 56px)",
    },
    bottomNav: {
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      zIndex: 600,
    },
  })
);

const MainLayout: React.VFC<PropsWithChildren<unknown>> = ({ children }) => {
  const classes = useStyles();
  const titleCtx = useTitleContext();
  const { currentUserId } = useAuthState();

  return (
    <Paper square elevation={0} className={classes.root}>
      <TopBar title={titleCtx.title} className={classes.topBar} />
      <main className={classes.main}>{children}</main>
      {currentUserId && <BottomNav className={classes.bottomNav} />}
    </Paper>
  );
};

export default MainLayout;
