import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Card, CardContent, Grid, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import axios from "axios";
import AccountIcon from "components/AccountIcon";
import CardList from "components/CardList";
import ErrorDialog from "components/ErrorDialog";
import QRScanner from "components/QRScanner";
import { useTitleSet } from "libs/title";
import { StorageUserInfo } from "hooks/auth/@types";
import { useAuthDispatch, useAuthState } from "hooks/auth/useAuth";
import routes from "libs/routes";
import { StatusColor } from "types/statusColor";

const useStyles = makeStyles((theme) =>
  createStyles({
    noPadding: {
      padding: "0 !important",
      objectFit: "cover",
    },
    confirm: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "calc(var(--100vh) * 0.5 - 56px - 50%)",
      "& > * + *": {
        marginTop: theme.spacing(4),
      },
    },
    userInfo: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      "& > * + *": {
        marginTop: theme.spacing(0.5),
      },
      "& > *:first-child": {
        marginBottom: theme.spacing(1),
      },
    },
    userIcon: {
      width: 80,
      height: 80,
    },
    login: {
      display: "flex",
      flexDirection: "column",
      "& > * + *": {
        marginTop: theme.spacing(1.5),
      },
      boxSizing: "border-box",
      width: "100%",
      padding: "0 24px",
    },
  })
);

const LoginWithQR: React.VFC = () => {
  useTitleSet("QRコードでログイン");

  const classes = useStyles();
  const history = useHistory();
  const { currentUserId } = useAuthState();
  const { registerUser } = useAuthDispatch();

  const [checkStatus, setCheckStatus] = useState<
    StatusColor | "confirm" | null
  >(null);
  const [user, setUser] = useState<StorageUserInfo | null>(null);
  const [errorText, setErrorText] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleScan = (data: string) => {
    if (checkStatus === "loading") return;
    setCheckStatus("loading");

    const obj = (() => {
      try {
        const json = atob(data);
        return JSON.parse(json);
      } catch (e) {
        setCheckStatus("error");
        setDialogOpen(true);
        if (e instanceof DOMException) {
          setErrorText([
            "デコード中に問題が発生しました。",
            "誤った QR コードをスキャンしている可能性があります。",
          ]);
        } else if (e instanceof SyntaxError) {
          setErrorText([
            "パース中に問題が発生しました。",
            "誤った QR コードをスキャンしている可能性があります。",
          ]);
        } else {
          setErrorText([
            "変換中の不明なエラーです。",
            "誤った QR コードをスキャンしている可能性があります。",
          ]);
        }
        return null;
      }
    })();

    if (obj === null) return;

    if (
      typeof obj !== "object" ||
      !Object.prototype.hasOwnProperty.call(obj, "id") ||
      !Object.prototype.hasOwnProperty.call(obj, "pw")
    )
      return;

    const id = obj.id;
    const pw = obj.pw;
    if (typeof id === "string" && typeof pw === "string") {
      api(aspida())
        .auth.login.$post({ body: { id: id, password: pw } })
        .then((res) => {
          api(aspida())
            .auth.me.$get({
              headers: {
                Authorization: "bearer " + res.token,
              },
            })
            .then((Info) => {
              setCheckStatus("confirm");
              setUser({ ...Info, token: res.token });
            })
            .catch((e) => {
              setCheckStatus("error");
              setDialogOpen(true);
              setErrorText([
                "情報を取得できませんでした。",
                (axios.isAxiosError(e) && e.response?.data.message) ||
                  e.message,
              ]);
            });
        })
        .catch((e) => {
          setCheckStatus("error");
          setDialogOpen(true);
          if (e.response?.status === 401)
            setErrorText([
              "ID またはパスワードが間違っています。",
              "QR コードが古い可能性があります。展示責任者から提示された最新の QR コードを使用してください。",
            ]);
          else if (e.response?.status === 429)
            setErrorText([
              "ログイン失敗が多すぎます。",
              "QR コードを確認し、1分後にもう一度お試しください。",
            ]);
          else
            setErrorText([
              "不明なエラーです。もう一度お試しください。",
              `Message: ${
                (axios.isAxiosError(e) && e.response?.data.message) || e.message
              }`,
            ]);
        });
    }
  };

  const confirmLogin = () => {
    if (user)
      registerUser(user.token).then(() => {
        if (gtag) gtag("event", "login");
        history.push(routes.Home.route.create({}));
      });
  };

  const cancelLogin = () => {
    history.push(routes[currentUserId ? "Home" : "Login"].route.create({}));
  };

  return (
    <Grid container justify="center">
      <Grid xs={12} sm={10} md={8}>
        {checkStatus === "confirm" ? (
          <div className={classes.confirm}>
            {user ? (
              <>
                <Typography variant="h5">ログインしますか？</Typography>
                <div className={classes.userInfo}>
                  <AccountIcon account={user} className={classes.userIcon} />
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body2">@{user.id}</Typography>
                </div>
                <div className={classes.login}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth={true}
                    onClick={confirmLogin}
                  >
                    ログイン
                  </Button>
                  <Button
                    variant="text"
                    color="secondary"
                    size="small"
                    fullWidth={true}
                    onClick={cancelLogin}
                  >
                    キャンセル
                  </Button>
                </div>
              </>
            ) : (
              <Typography>ユーザーが見つかりませんでした。</Typography>
            )}
          </div>
        ) : (
          <>
            <CardList>
              <Card>
                <CardContent className={classes.noPadding}>
                  <QRScanner
                    onScanFunc={handleScan}
                    videoStop={false}
                    color={checkStatus ?? undefined}
                  />
                </CardContent>
              </Card>
              <Card>
                <Alert severity="info">
                  <Typography variant="body2">
                    配布されたQRコードをスキャンしてください。
                  </Typography>
                </Alert>
              </Card>
            </CardList>
            <ErrorDialog
              open={dialogOpen}
              message={errorText}
              onClose={() => {
                setDialogOpen(false);
              }}
            />
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default LoginWithQR;
