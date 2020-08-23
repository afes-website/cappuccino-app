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
      height: "100vh",
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
      <Paper className={classes.root}>
        <TopBar title="Manager for Exhibition" />
        {props.children}
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
