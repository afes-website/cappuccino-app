import React from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import api from "@afes-website/docs";
import axios from "@aspida/axios";
import { AuthContext } from "@/libs/auth";
import routes from "@/libs/routes";

const useStyles = makeStyles({
  root: {
    padding: "10px",
  },
  form: {
    display: "block",
    margin: 0,
    padding: 0,
  },
  mb: {
    marginBottom: "10px",
  },
});

const Login: React.FunctionComponent = () => {
  const classes = useStyles();
  const history = useHistory();
  const [id, setId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isError, setIsError] = React.useState(false);
  const auth = React.useContext(AuthContext);

  const login = (e?: React.FormEvent<HTMLFormElement>) => {
    api(axios())
      .auth.login.$post({
        body: {
          id: id,
          password: password,
        },
      })
      .then((res) => {
        auth.val.register_user(res.token).then(() => {
          auth.val.switch_user(id);
          history.push(routes.Home.route.create({}));
        });
      })
      .catch(() => {
        setIsError(true);
      });
    if (e) e.preventDefault();
  };

  return (
    <div className={classes.root}>
      <Card>
        <form onSubmit={login} className={classes.form}>
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
              error={isError}
            />
            <TextField
              label="パスワード"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              fullWidth={true}
              error={isError}
            />
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              fullWidth={true}
              disabled={!(id && password)}
              type="submit"
            >
              ログイン
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default Login;
