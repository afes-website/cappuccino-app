import React from "react";
import PropTypes from "prop-types";
import {
  createStyles,
  makeStyles,
  Paper,
  ThemeProvider,
} from "@material-ui/core";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import themes from "@/assets/styles/theme";

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
    },
    main: {
      marginBottom: "56px", // bottom Nav
    },
    bottomNav: {
      position: "fixed",
      bottom: 0,
      width: "100%",
    },
  })
);

interface Props {
  children: React.ReactNode;
}

const MainLayout: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={themes.light}>
      <Paper className={classes.root} square={true}>
        <div className={classes.topBar}>
          <TopBar title="Manager for Exhibition" />
        </div>
        <main className={classes.main}>{props.children}</main>
        <div className={classes.bottomNav}>
          <BottomNav />
        </div>
      </Paper>
    </ThemeProvider>
  );
};

MainLayout.propTypes = {
  children: PropTypes.any,
};

export default MainLayout;
