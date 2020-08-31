import React from "react";
import { createStyles, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: "10px",
    },
  })
);

const ScanHistory: React.FunctionComponent = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5" component="h2">
        Scan History
      </Typography>
    </div>
  );
};
export default ScanHistory;
