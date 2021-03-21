import React from "react";
import ReactSimplePullToRefresh from "react-simple-pull-to-refresh";
import { CircularProgress, Paper } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Refresh } from "@material-ui/icons";

const useStyles = makeStyles((theme) =>
  createStyles({
    pulling: {
      display: "block",
      margin: "0 auto",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      width: 26,
      height: 26,
      padding: 4,
      borderRadius: 100,
      background: "#fff",
      color: theme.palette.primary.main,
    },
    progress: {
      margin: "0 auto",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      width: 34,
      height: 34,
      borderRadius: 100,
      background: "#fff",
      color: theme.palette.primary.main,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  })
);

export interface PullToRefreshProps {
  onRefresh: () => Promise<unknown>;
  // isPullable?: boolean;
  children: JSX.Element;
}

const PullToRefresh: React.FC<PullToRefreshProps> = (props) => {
  const { children, ...libProps } = props;
  const classes = useStyles();

  return (
    <ReactSimplePullToRefresh
      pullingContent={
        <Paper elevation={3} className={classes.pulling}>
          <Refresh color="secondary" />
        </Paper>
      }
      refreshingContent={
        <Paper elevation={3} className={classes.progress}>
          <CircularProgress color="inherit" size={18} thickness={6} />
        </Paper>
      }
      {...libProps}
    >
      {children}
    </ReactSimplePullToRefresh>
  );
};

export default PullToRefresh;
