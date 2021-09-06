import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import api from "@afes-website/docs";
import axios from "@aspida/axios";
import CardList from "components/CardList";
import ErrorDialog from "components/ErrorDialog";
import QRScanner from "components/QRScanner";
import isAxiosError from "libs/isAxiosError";
import { useTitleSet } from "libs/title";
import { useAuthDispatch } from "libs/auth/useAuth";
import routes from "libs/routes";
import { StatusColor } from "types/statusColor";

const useStyles = makeStyles((theme) =>
  createStyles({
    noPadding: {
      padding: "0 !important",
      objectFit: "cover",
    },
  })
);

const LoginQR: React.VFC = () => {
  useTitleSet("QRコードでログイン");
  const classes = useStyles();
  const history = useHistory();
  const { registerUser } = useAuthDispatch();
  const [checkStatus, setCheckStatus] = useState<StatusColor | null>(null);
  const [id, setId] = useState("");
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
      setId(id);
      if (typeof id === "string" && typeof pw === "string") {
        api(axios())
          .auth.login.$post({ body: { id: id, password: pw } })
          .then((res) => {
            registerUser(res.token).then(() => {
              setCheckStatus("success");
              if (gtag) gtag("event", "login");
              history.push(routes.Home.route.create({}));
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

  return (
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
        <CardContent className={classes.noPadding}>
          <List>
            <ListItem>
              {/*ListItemIcon*/}
              <ListItemText primary={id ? id : "-"} secondary="User Id" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      <Card>
        <ErrorDialog
          open={dialogOpen}
          message={errorText}
          onClose={() => {
            setDialogOpen(false);
          }}
        />
      </Card>
    </CardList>
  );
};

export default LoginQR;
