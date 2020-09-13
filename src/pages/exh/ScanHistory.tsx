import React from "react";
import { createStyles, makeStyles, Typography } from "@material-ui/core";
import TitleContext from "@/libs/titleContext";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: "10px",
    },
  })
);

const ScanHistory: React.FunctionComponent = () => {
  const classes = useStyles();
  const title = React.useContext(TitleContext);

  React.useEffect(() => {
    title.set("スキャン履歴");
  }, []);

  return (
    <div className={classes.root}>
      <Typography variant="h5" component="h2">
        Scan History
      </Typography>
    </div>
  );
};
export default ScanHistory;
