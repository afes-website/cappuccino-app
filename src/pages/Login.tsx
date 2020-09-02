import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    padding: "10px",
  },
  mb: {
    marginBottom: "10px",
  },
});

const Login: React.FunctionComponent = () => {
  const classes = useStyles();
  const [id, setId] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          <Typography variant="body2" className={classes.mb}>
            配布されたアカウントを追加
          </Typography>
          <TextField
            label="ID"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
            }}
            className={classes.mb}
            fullWidth={true}
          />
          <TextField
            label="パスワード"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            fullWidth={true}
          />
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" fullWidth={true}>
            ログイン
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default Login;
