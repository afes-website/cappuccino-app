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
import CardList from "components/CardList";
import QRScanner from "components/QRScanner";
import api from "@afes-website/docs";
import axios from "@aspida/axios";
import { useTitleSet } from "libs/title";
import { useAuthDispatch } from "libs/auth/useAuth";
import routes from "libs/routes";
import { StatusColor } from "../types/statusColor";

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

  const handleScan = (data: string | null) => {
    if (data && encoded !== data && checkStatus !== "loading") {
      setCheckStatus("loading");
      setEncoded(data);
      const json = atob(data);
      const obj = JSON.parse(json);

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
              // setError(e);
            });
        }
        // invalid json
      }
      // invalid qr
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
    </CardList>
  );
};

export default LoginQR;
