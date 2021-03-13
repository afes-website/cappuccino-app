import React from "react";
import { Button, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useTitleSet } from "@/libs/title";
import routes from "@/libs/routes";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "calc(100vh - 200px)",
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

const Forbidden: React.FunctionComponent = () => {
  useTitleSet("403 Forbidden");
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.root}>
      <div className={classes.inner}>
        <Typography align="center" variant="h2">
          403
        </Typography>
        <Typography align="center" variant="body1" color="textSecondary">
          ページを開く権限がありません
        </Typography>
        <Typography align="center" variant="body1" color="textSecondary">
          現在のアカウントを確認してください
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

export default Forbidden;
