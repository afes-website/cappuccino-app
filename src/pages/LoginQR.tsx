import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import api from "@afes-website/docs";
import axios from "@aspida/axios";
import AccountIcon from "components/AccountIcon";
import CardList from "components/CardList";
import ErrorDialog from "components/ErrorDialog";
import QRScanner from "components/QRScanner";
import isAxiosError from "libs/isAxiosError";
import { useTitleSet } from "libs/title";
import { StorageUserInfo } from "libs/auth/@types";
import { useAuthDispatch, useAuthState } from "libs/auth/useAuth";
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
      marginTop: "calc(var(--100vh) * 0.45 - 50%)",
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

const LoginQR: React.VFC = () => {
  useTitleSet("QRコードでログイン");

  const classes = useStyles();
  const history = useHistory();
  const { currentUserId } = useAuthState();
  const { registerUser } = useAuthDispatch();

  const [checkStatus, setCheckStatus] = useState<
    StatusColor | "confirm" | null
  >(null);
  const [user, setUser] = useState<StorageUserInfo | null>(null);
  const [encoded, setEncoded] = useState("");
  const [errorText, setErrorText] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleScan = (data: string | null) => {
    if (data === null || encoded === data || checkStatus === "loading") return;
    setCheckStatus("loading");
    setEncoded(data);

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
            "読み取るQRコードが違う可能性があります。",
          ]);
        } else if (e instanceof SyntaxError) {
          setErrorText([
            "パース中に問題が発生しました。",
            "読み取るQRコードが違う可能性があります。",
          ]);
        } else {
          setErrorText([
            "変換中の不明なエラーです。",
            "読み取るQRコードが違う可能性があります。",
          ]);
        }
        return null;
      }
    })();

    if (obj === null) return;

    if (
      typeof obj === "object" &&
      Object.prototype.hasOwnProperty.call(obj, "id") &&
      Object.prototype.hasOwnProperty.call(obj, "pw")
    ) {
      const id = obj.id;
      const pw = obj.pw;

      if (typeof id === "string" && typeof pw === "string") {
        api(axios())
          .auth.login.$post({ body: { id: id, password: pw } })
          .then((res) => {
            api(axios())
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
                  "情報を取得できませんでした",
                  (isAxiosError(e) && e.response?.data.message) || e.message,
                ]);
              });
          })
          .catch((e) => {
            setCheckStatus("error");
            setDialogOpen(true);
            if (e.response?.status === 401)
              setErrorText([
                "ID またはパスワードが間違っています。",
                "QRコードが古い可能性があります。展示責任者から最新のQRコードを受け取って下さい。",
              ]);
            else if (e.response?.status === 429)
              setErrorText([
                "ログイン失敗が多すぎます。",
                "QRコードを確認し、1分後にもう一度お試しください。",
              ]);
            else
              setErrorText([
                "不明なエラーです。もう一度お試しください。",
                `Message: ${
                  (isAxiosError(e) && e.response?.data.message) || e.message
                }`,
              ]);
          });
      }
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
    <div>
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
    </div>
  );
};

export default LoginQR;
