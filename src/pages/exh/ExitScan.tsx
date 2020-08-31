import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import QRScanner from "@/components/QRScanner.";
import {
  Card,
  CardContent,
  Snackbar,
  Typography,
  Paper,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

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

const ExitScan: React.FunctionComponent = () => {
  const classes = useStyles();
  const [guestId, setGuestId] = React.useState("");
  const [open, setOpen] = React.useState(false);

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
          {guestId} 退室完了
        </Alert>
      </Snackbar>
    </div>
  );
};

const getErrorMessage = (status_code: string) => {
  switch (status_code) {
    case "GUEST_NOT_FOUND":
      return "来場者が存在しません。";
    case "GUEST_ALREADY_EXITED":
      return "来場者は既に退場済みです。";
  }
};

export default ExitScan;
