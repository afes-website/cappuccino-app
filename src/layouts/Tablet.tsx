import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { createStyles, Grid, makeStyles, Paper } from "@material-ui/core";
import TopBar from "components/TopBar";
import SideNav from "components/SideNav";
import { useTitleContext } from "libs/title";
import clsx from "clsx";
import { Menu } from "@material-ui/icons";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "var(--100vh, 0px)",
      boxSizing: "border-box",
      paddingTop: "env(safe-area-inset-top)",
      position: "relative",
    },
    content: {
      height: "calc(var(--100vh, 0px) - env(safe-area-inset-top))",
      boxSizing: "border-box",
      width: "100%",
      overflowY: "scroll",
      overscrollBehavior: "none",
      background: theme.palette.background.default,
    },
    topBar: {
      position: "absolute",
      top: 0,
      right: 0,
      width: "100vw",
      zIndex: 600,
    },
    main: {
      width: "100%",
      boxSizing: "border-box",
      padding: theme.spacing(8),
      paddingTop: 56,
      paddingBottom: "env(safe-area-inset-bottom)",
    },
    openButton: {
      position: "absolute",
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
    fullScreenContent: {
      transition: "all 0.3s ease",
    },
    mainFullScreen: {
      [theme.breakpoints.down("sm")]: {
        transform: "translateX(-25%)",
      },
      [theme.breakpoints.up("md")]: {
        transform: "translateX(-16.666%)",
      },
    },
  })
);

const TabletLayout: React.VFC<PropsWithChildren<unknown>> = ({ children }) => {
  const classes = useStyles();
  const titleCtx = useTitleContext();

  const [scrollTop, setScrollTop] = useState(0);
  const [navOpen, setNavOpen] = useState(true);
  const content = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    setScrollTop(content.current ? content.current.scrollTop : 0);
  };

  useEffect(() => {
    const ref = content.current;
    if (!ref) return;
    ref.addEventListener("scroll", onScroll);
    return () => {
      ref.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Grid container className={classes.root}>
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
      <Grid item sm={4} md={3}>
        <SideNav
          navOpen={navOpen}
          setNavOpen={setNavOpen}
          className={classes.content}
        />
      </Grid>
      <Grid
        item
        sm={8}
        md={9}
        className={clsx(classes.fullScreenContent, {
          [classes.mainFullScreen]: !navOpen,
        })}
      >
        <Paper
          square={true}
          ref={content}
          className={classes.content}
          elevation={0}
        >
          <Grid container className={classes.topBar}>
            <Grid item sm={4} md={3} />
            <Grid item sm={8} md={9}>
              <TopBar
                title={titleCtx.title}
                scrollTop={scrollTop}
                hideBackButton={!navOpen}
              />
            </Grid>
          </Grid>
          <main className={classes.main}>{children}</main>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TabletLayout;
