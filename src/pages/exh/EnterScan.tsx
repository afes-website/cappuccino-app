import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import QRScanner from "@/components/QRScanner";
import {
  Card,
  CardContent,
  Snackbar,
  Typography,
  Paper,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useTitleSet } from "@/libs/title";

const useStyles = makeStyles({
  root: {
    padding: "10px",
  },
  card: {
    marginBottom: "10px",
  },
  noPadding: {
    padding: "0 !important",
    objectFit: "cover",
  },
  guestId: {
    display: "inline-block",
    marginBottom: "10px",
  },
  snackBar: {
    bottom: "64px",
  },
});

const EnterScan: React.FunctionComponent = () => {
  const classes = useStyles();
  const [guestId, setGuestId] = React.useState("");
  const [open, setOpen] = React.useState(false);
  useTitleSet("入室スキャン");

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const onScan = (data: string | null) => {
    if (data) {
      if (guestId !== data) {
        setOpen(false);
        setTimeout(() => {
          setOpen(true);
          setGuestId(data);
        }, 100);
      }
    }
  };

  // TODO: 本実装で置き換え

  const exhName = "AZABU GAME CENTER";
  const statusCode = "GUEST_NOT_FOUND";

  return (
    <div className={classes.root}>
      <Paper className={classes.card}>
        <Alert variant="outlined" severity="info">
          展示名: {exhName}
        </Alert>
      </Paper>
      <Card className={classes.card}>
        <CardContent className={classes.noPadding}>
          <QRScanner onScanFunc={onScan} videoStop={false} />
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" component="span" className={classes.guestId}>
            Guest ID: {guestId}
          </Typography>
          <Alert severity="warning">退場まで残り 15 分です。</Alert>
          <Alert severity="error">{getErrorMessage(statusCode)}</Alert>
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" component="span">
            ExhStatus Component
          </Typography>
        </CardContent>
      </Card>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        className={classes.snackBar}
      >
        <Alert severity="success" variant="filled" onClick={handleClose}>
          {guestId} 入室完了
        </Alert>
      </Snackbar>
    </div>
  );
};

const getErrorMessage = (status_code: string) => {
  switch (status_code) {
    case "GUEST_NOT_FOUND":
      return "来場者が存在しません。";
    case "GUEST_ALREADY_ENTERED":
      return "来場者は既に入室済みです。";
    case "PEOPLE_LIMIT_EXCEEDED":
      return "展示の人数制限に達しています。";
    case "GUEST_ALREADY_EXITED":
      return "来場者は既に退場済みです。";
    case "EXIT_TIME_EXCEEDED":
      return "退場予定時刻を過ぎています。";
  }
};

export default EnterScan;
