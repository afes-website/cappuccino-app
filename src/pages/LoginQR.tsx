import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, CardContent } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import CardList from "components/CardList";
import QRScanner from "components/QRScanner";
import api from "@afes-website/docs";
import axios from "@aspida/axios";
import { useTitleSet } from "libs/title";
import { useAuthDispatch } from "libs/auth/useAuth";
import routes from "libs/routes";

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

  const [encoded, setEncoded] = useState("");

  const handleScan = (data: string | null) => {
    if (data === null) return;
    if (data !== encoded) setEncoded(data);
    // loading

    const json = atob(data);
    const obj = JSON.parse(json);

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
            registerUser(res.token).then(() => {
              // success
              if (gtag) gtag("event", "login");
              history.push(routes.Home.route.create({}));
            });
          });
      }
      // invalid json
    }
    // invalid qr
  };

  return (
    <CardList>
      <Card>
        <CardContent className={classes.noPadding}>
          <QRScanner
            onScanFunc={handleScan}
            videoStop={false}
            color={"success"}
          />
        </CardContent>
      </Card>
    </CardList>
  );
};

export default LoginQR;
