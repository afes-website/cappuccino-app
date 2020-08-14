import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    padding: "1rem",
  },
  title: {
    marginBottom: "8px",
  },
});

const Home: React.FunctionComponent = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="h2" className={classes.title}>
            入退室 QRコードスキャン
          </Typography>
          <Typography variant="body2" paragraph={true}>
            自展示への入退室者のリストバンドのQRコードを読み取ることで、入退室処理を行えます。
          </Typography>
          <Typography variant="body2" paragraph={true}>
            画面に案内が出た場合は、表示された内容を来場者に案内してください。
          </Typography>
        </CardContent>
        <CardActions>
          <Button color="secondary">入室スキャン</Button>
          <Button color="secondary">退室スキャン</Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default Home;
