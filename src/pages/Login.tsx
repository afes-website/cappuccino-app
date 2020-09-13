import React from "react";
import { useHistory } from "react-router-dom";
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
import { AuthContext } from "@/libs/auth";
import routes from "@/libs/routes";
import isAxiosError from "@/libs/isAxiosError";
import TitleContext from "@/libs/titleContext";

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
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorText, setErrorText] = React.useState<string[]>([]);
  const auth = React.useContext(AuthContext);
  const title = React.useContext(TitleContext);

  React.useEffect(() => {
    title.set("ログイン");
  }, []);

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
        auth.val.register_user(res.token).then(() => {
          auth.val.switch_user(id);
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
    <div className={classes.root}>
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
    </div>
  );
};

export default Login;
