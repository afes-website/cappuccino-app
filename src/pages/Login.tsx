import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Fade,
  FormGroup,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import axios from "axios";
import CardList from "components/CardList";
import PwaAlertCard from "components/PwaAlertCard";
import { useAuthDispatch } from "libs/auth/useAuth";
import routes from "libs/routes";
import { useTitleSet } from "libs/title";

const useStyles = makeStyles((theme) =>
  createStyles({
    form: {
      display: "block",
      margin: 0,
      padding: 0,
    },
    mb: {
      marginBottom: theme.spacing(1),
    },
    terms: {
      width: "100%",
    },
    divider: {
      display: "flex",
      alignItems: "center",
      margin: "16px 0",
      "&::before, &::after": {
        content: '""',
        flexGrow: 1,
        height: 1,
        background: theme.palette.divider,
        margin: "0 16px",
      },
    },
  })
);

const Login: React.VFC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { registerUser } = useAuthDispatch();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string[]>([]);
  const [revokedId, setRevokedId] = useState<string | null>(null);
  useTitleSet("ログイン");

  useEffect(() => {
    const state: unknown = history.location.state;
    if (state && typeof state === "object") {
      const stateObj = state as Record<string, unknown>;
      if (
        Object.prototype.hasOwnProperty.call(stateObj, "id") &&
        typeof stateObj.id === "string"
      ) {
        setRevokedId(stateObj.id);
        setId(stateObj.id);
      }
    }
  }, [history.location.state]);

  const login = (e?: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    setIsError(false);
    setErrorText([]);
    // ログイン失敗として 401 が返ってくるので useAspidaClient しない！
    api(aspida())
      .auth.login.$post({
        body: {
          id: id,
          password: password,
        },
      })
      .then((res) => {
        registerUser(res.token).then(() => {
          if (gtag) gtag("event", "login");
          history.push(routes.Home.route.create({}));
        });
      })
      .catch((e) => {
        setIsError(true);
        if (e.response?.status === 401)
          setErrorText(["ID またはパスワードが間違っています。"]);
        else if (e.response?.status === 429)
          setErrorText([
            "ログイン失敗が多すぎます。",
            "ID・パスワードを確認し、1分後にもう一度お試しください。",
          ]);
        else
          setErrorText([
            "不明なエラーです。もう一度お試しください。",
            `Message: ${
              (axios.isAxiosError(e) && e.response?.data.message) || e.message
            }`,
          ]);
      })
      .finally(() => {
        setIsLoading(false);
      });
    if (e) e.preventDefault();
  };

  return (
    <Grid container justify="center">
      <Grid item xs={12} sm={10} md={8}>
        <CardList>
          <PwaAlertCard />
          <Card>
            <form onSubmit={login} className={classes.form}>
              <CardContent>
                <Typography variant="body2" className={classes.mb}>
                  {revokedId
                    ? `@${revokedId} を使用するにはログインしてください`
                    : "配布されたアカウントを追加"}
                </Typography>
                <FormGroup className={classes.mb}>
                  {isError
                    ? errorText.map((error, index) => {
                        return (
                          <FormHelperText key={index} error={true}>
                            {error}
                          </FormHelperText>
                        );
                      })
                    : ""}
                </FormGroup>
                <TextField
                  label="ID"
                  value={id}
                  onChange={(e) => {
                    setId(e.target.value);
                  }}
                  className={classes.mb}
                  fullWidth={true}
                  color="secondary"
                  error={isError}
                  inputProps={{
                    autoCapitalize: "off",
                  }}
                />
                <TextField
                  label="パスワード"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  fullWidth={true}
                  color="secondary"
                  error={isError}
                />
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth={true}
                  disabled={!(id && password) || isLoading}
                  type="submit"
                >
                  {isLoading ? (
                    <Fade
                      in={isLoading}
                      style={{ transitionDelay: "300ms" }}
                      unmountOnExit
                    >
                      <CircularProgress
                        color="inherit"
                        size={24}
                        thickness={5}
                      />
                    </Fade>
                  ) : (
                    "ログイン"
                  )}
                </Button>
              </CardActions>
              <div className={classes.divider}>
                <Typography variant="body2" color="textSecondary">
                  または
                </Typography>
              </div>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={routes.LoginWithQR.route.create({})}
                  fullWidth={true}
                >
                  QRコードでログイン
                </Button>
              </CardActions>
            </form>
          </Card>
          <div>
            <Button
              variant="text"
              color="inherit"
              component={Link}
              to={routes.Terms.route.create({})}
              className={classes.terms}
            >
              利用規約 & プライバシーポリシー
            </Button>
            <Button
              variant="text"
              color="inherit"
              component="span"
              className={classes.terms}
              disabled
            >
              {`Version ${process.env.REACT_APP_VERSION}-${process.env.REACT_APP_BUILD_NUMBER}`}
            </Button>
          </div>
        </CardList>
      </Grid>
    </Grid>
  );
};

export default Login;
