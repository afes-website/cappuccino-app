import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    padding: "1rem",
  },
  title: {
    marginBottom: "8px",
  },
});

const Scan: React.FunctionComponent = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h1>Scan Page</h1>
    </div>
  );
};

export default Scan;
