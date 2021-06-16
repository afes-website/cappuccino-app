import React, { useContext, useState } from "react";
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
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import api from "@afes-website/docs";
import axios from "@aspida/axios";
import CardList from "components/CardList";
import PwaAlertCard from "components/PwaAlertCard";
import { AuthContext } from "libs/auth";
import routes from "libs/routes";
import isAxiosError from "libs/isAxiosError";
import { useTitleSet } from "libs/title";
import { createStyles } from "@material-ui/core/styles";

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
  })
);

const Login: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string[]>([]);
  const auth = useContext(AuthContext).val;
  useTitleSet("ログイン");

  const login = (e?: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    api(axios())
      .auth.login.$post({
        body: {
          id: id,
          password: password,
        },
      })
      .then((res) => {
        auth.register_user(res.token).then(() => {
          auth.switch_user(id);
          if (gtag) gtag("event", "login");
          history.push(routes.Home.route.create({}));
        });
      })
      .catch((e) => {
        setIsError(true);
        if (e.response?.status === 401)
          setErrorText(["ID またはパスワードが間違っています。"]);
        else
          setErrorText([
            "不明なエラーです。もう一度お試しください。",
            `Message: ${
              (isAxiosError(e) && e.response?.data.message) || e.message
            }`,
          ]);
      })
      .finally(() => {
        setIsLoading(false);
      });
    if (e) e.preventDefault();
  };

  return (
    <CardList>
      <PwaAlertCard />
      <Card>
        <form onSubmit={login} className={classes.form}>
          <CardContent>
            <Typography variant="body2" className={classes.mb}>
              配布されたアカウントを追加
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
                autocapitalize: "off",
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
              disabled={!(id && password)}
              type="submit"
            >
              {isLoading ? (
                <Fade
                  in={isLoading}
                  style={{ transitionDelay: "500ms" }}
                  unmountOnExit
                >
                  <CircularProgress color="inherit" size={24} thickness={5} />
                </Fade>
              ) : (
                "ログイン"
              )}
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
  );
};

export default Login;
