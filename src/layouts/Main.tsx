import React from "react";
import { createStyles, makeStyles, Paper } from "@material-ui/core";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useTitleContext } from "@/libs/title";
import ProvidersProvider from "@/components/ProvidersProvider";

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

const MainLayout: React.FC = (props) => {
  const classes = useStyles();
  const titleCtx = useTitleContext();

  return (
    <Paper className={classes.root} square={true}>
      <div className={classes.topBar}>
        <TopBar title={titleCtx.title} />
      </div>
      <main className={classes.main}>{props.children}</main>
      <div className={classes.bottomNav}>
        <BottomNav />
      </div>
    </Paper>
  );
};

const MainLayoutWithProviders: React.FC = (props) => (
  <ProvidersProvider>
    <MainLayout>{props.children}</MainLayout>
  </ProvidersProvider>
);

export default MainLayoutWithProviders;
