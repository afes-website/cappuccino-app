import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  Snackbar,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import QRScanner from "@/components/QRScanner.";
import DirectInputModal from "@/components/DirectInputModal";
import DirectInputFab from "@/components/DirectInputFab";
import { useTitleSet } from "@/libs/title";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import { AuthContext } from "@/libs/auth";
import isAxiosError from "@/libs/isAxiosError";

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
    bottom: "136px",
    maxWidth: "100%",
  },
  bottomButton: {
    position: "fixed",
    right: "16px",
    bottom: "72px",
  },
  fabIcon: {
    marginRight: "8px",
  },
});

const ExitScan: React.FC = () => {
  const classes = useStyles();
  const [latestGuestId, setLatestGuestId] = useState("");
  const [opensGuestInputModal, setOpensGuestInputModal] = useState(false);
  const [errorStatusCode, setErrorStatusCode] = useState<StatusCode | null>(
    null
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  useTitleSet("退場スキャン");
  const auth = useContext(AuthContext);

  const handleGuestIdScan = (guestId: string | null) => {
    if (guestId && latestGuestId !== guestId) {
      setLatestGuestId(guestId);
      post(guestId).finally(() => {
        setSnackBarOpen(true);
      });
    }
  };

  const handleSnackBarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const post = (guestId: string): Promise<void> => {
    return api(aspida())
      .onsite.general.exit.$post({
        body: {
          guest_id: guestId,
        },
        headers: {
          Authorization: "bearer " + auth.val.get_current_user()?.token,
        },
      })
      .then(() => {
        setIsSuccess(true);
        setErrorStatusCode(null);
      })
      .catch((e) => {
        setIsSuccess(false);
        if (isAxiosError(e)) {
          if (e.response?.status === 404) {
            setErrorStatusCode("GUEST_NOT_FOUND");
          }
          if (e.response?.status === 409) {
            setErrorStatusCode("GUEST_ALREADY_EXITED");
          }
        }
      });
  };

  return (
    <div className={classes.root}>
      {/* QR Scanner */}
      <Card className={classes.card}>
        <CardContent className={classes.noPadding}>
          <QRScanner onScanFunc={handleGuestIdScan} videoStop={false} />
        </CardContent>
      </Card>

      {/* Error Alert */}
      {errorStatusCode && (
        <Card className={classes.card}>
          <CardContent className={classes.noPadding}>
            <Alert severity="error">{getErrorMessage(errorStatusCode)}</Alert>
          </CardContent>
        </Card>
      )}

      {/* ID List */}
      <Card>
        <CardContent className={classes.noPadding}>
          <List>
            <ListItem>
              <ListItemText
                primary={latestGuestId ? latestGuestId : "-"}
                secondary="ゲスト ID (リストバンド ID)"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <DirectInputFab
        onClick={() => {
          setOpensGuestInputModal(true);
        }}
      />

      {/* Snack Bar */}
      <Snackbar
        open={snackBarOpen}
        key={latestGuestId}
        autoHideDuration={isSuccess ? 3000 : null}
        onClose={handleSnackBarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        className={classes.snackBar}
      >
        <Alert
          severity={isSuccess ? "success" : "error"}
          variant="filled"
          onClick={handleSnackBarClose}
          onClose={handleSnackBarClose}
        >
          {latestGuestId} {`退場${isSuccess ? "完了" : "失敗"}`}
        </Alert>
      </Snackbar>

      {/* 直接入力モーダル */}
      <DirectInputModal
        open={opensGuestInputModal}
        setOpen={setOpensGuestInputModal}
        onIdChange={handleGuestIdScan}
        currentId={latestGuestId}
        type="guest"
      />
    </div>
  );
};

const getErrorMessage = (status_code: StatusCode) => {
  switch (status_code) {
    case "GUEST_NOT_FOUND":
      return "来場者が存在しません。";
    case "GUEST_ALREADY_EXITED":
      return "来場者は既に退場済みです。";
  }
};

const statusCodeList = ["GUEST_NOT_FOUND", "GUEST_ALREADY_EXITED"] as const;

type StatusCode = typeof statusCodeList[number];

export default ExitScan;
