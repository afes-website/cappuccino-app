import React, { useContext } from "react";
import { createStyles, makeStyles, Paper } from "@material-ui/core";
import TopBar from "components/TopBar";
import BottomNav from "components/BottomNav";
import { useTitleContext } from "libs/title";
import ProvidersProvider from "components/ProvidersProvider";
import { AuthContext } from "libs/auth";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100vh",
      width: "100vw",
      overflowY: "scroll",
      overscrollBehavior: "none",
      background: theme.palette.background.default,
    },
    topBar: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 600,
    },
    main: {
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

const MainLayout: React.FC = (props) => {
  const classes = useStyles();
  const titleCtx = useTitleContext();
  const auth = useContext(AuthContext).val;

  return (
    <Paper className={classes.root} square={true}>
      <TopBar title={titleCtx.title} className={classes.topBar} />
      <main className={classes.main}>{props.children}</main>
      {auth.get_current_user_id() && (
        <BottomNav className={classes.bottomNav} />
      )}
    </Paper>
  );
};

const MainLayoutWithProviders: React.FC = (props) => (
  <ProvidersProvider>
    <MainLayout>{props.children}</MainLayout>
  </ProvidersProvider>
);

export default MainLayoutWithProviders;
