import React, { PropsWithChildren, useState } from "react";
import { createStyles, makeStyles, Paper } from "@material-ui/core";
import TopBar from "components/TopBar";
import SideNav from "components/SideNav";
import { useTitleContext } from "libs/title";
import clsx from "clsx";
import { Menu } from "@material-ui/icons";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100%",
      minHeight: "var(--100vh)",
      boxSizing: "border-box",
      paddingTop: "env(safe-area-inset-top)",
      position: "relative",
      background: "none",
    },
    sideNav: {
      height: "var(--100vh)",
      overflowY: "scroll",
      position: "fixed",
      boxSizing: "border-box",
      background: theme.palette.background.default,
      top: 0,
      left: 0,
      width: 300,
    },
    topBar: {
      position: "fixed",
      top: 0,
      right: 0,
      zIndex: 600,
      width: "calc(100% - 300px)",
      marginLeft: 300,
      transition: "all 0.3s ease",
    },
    topBarFullScreen: {
      right: 150,
    },
    main: {
      height: "100%",
      width: "calc(100% - 300px)",
      marginLeft: 300,
      boxSizing: "border-box",
      padding: theme.spacing(8),
      paddingTop: 64,
      paddingBottom: "env(safe-area-inset-bottom)",
      transition: "all 0.3s ease",
    },
    mainFullScreen: {
      transform: "translateX(-150px)",
    },
    openButton: {
      position: "fixed",
      background: theme.palette.background.default,
      color: theme.palette.text.secondary,
      boxShadow: theme.shadows[2],
      borderRadius: "0 8px 8px 0",
      boxSizing: "border-box",
      left: 0,
      bottom: 8,
      width: 56,
      height: 48,
      padding: 12,
      paddingLeft: 16,
      transform: "translateX(-150%)",
      transition: "all 0.3s ease 0.3s",
      cursor: "pointer",
    },
    openButtonClosed: {
      transform: "translateX(0)",
    },
  })
);

const TabletLayout: React.VFC<PropsWithChildren<unknown>> = ({ children }) => {
  const classes = useStyles();
  const titleCtx = useTitleContext();

  const [navOpen, setNavOpen] = useState(true);

  return (
    <Paper square elevation={0} className={classes.root}>
      <div
        onClick={() => {
          setNavOpen(true);
        }}
        className={clsx(classes.openButton, {
          [classes.openButtonClosed]: !navOpen,
        })}
      >
        <Menu />
      </div>
      <SideNav
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        className={classes.sideNav}
      />
      <TopBar
        title={titleCtx.title}
        hideBackButton={!navOpen}
        className={clsx(classes.topBar, {
          [classes.topBarFullScreen]: !navOpen,
        })}
      />
      <main
        className={clsx(classes.main, {
          [classes.mainFullScreen]: !navOpen,
        })}
      >
        {children}
      </main>
    </Paper>
  );
};

export default TabletLayout;
