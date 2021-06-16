import React from "react";
import { Button, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useTitleSet } from "libs/title";
import routes from "libs/routes";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "calc(var(--100vh, 100vh) - 200px)",
      padding: theme.spacing(2),
    },
    inner: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
    returnButton: {
      marginTop: theme.spacing(4),
    },
  })
);

const NotFound: React.VFC = () => {
  useTitleSet("404 Not Found");
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.root}>
      <div className={classes.inner}>
        <Typography align="center" variant="h2">
          404
        </Typography>
        <Typography align="center" variant="body1" color="textSecondary">
          ページが見つかりませんでした
        </Typography>
        <Typography align="center" variant="body1" color="textSecondary">
          URL が間違っている可能性があります
        </Typography>
        <Button
          onClick={() => {
            history.push(routes.Home.route.create({}));
          }}
          variant="contained"
          color="primary"
          className={classes.returnButton}
        >
          トップへ戻る
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
