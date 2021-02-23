import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import QRScanner from "@/components/QRScanner.";
import DirectInputModal from "@/components/DirectInputModal";
import DirectInputFab from "@/components/DirectInputFab";
import ResultChip, { ResultColor } from "@/components/ResultChip";
import { useTitleSet } from "@/libs/title";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import { AuthContext } from "@/libs/auth";
import isAxiosError from "@/libs/isAxiosError";
import clsx from "clsx";

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
  resultChipBase: {
    position: "relative",
  },
  resultChip: {
    position: "absolute",
    bottom: "8px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10,
  },
});

const ExitScan: React.FC = () => {
  const classes = useStyles();
  const [latestGuestId, setLatestGuestId] = useState("");
  const [opensGuestInputModal, setOpensGuestInputModal] = useState(false);
  const [errorStatusCode, setErrorStatusCode] = useState<StatusCode | null>(
    null
  );
  const [result, setResult] = useState<ResultColor | null>(null);
  useTitleSet("退場スキャン");
  const auth = useContext(AuthContext);

  const handleGuestIdScan = (guestId: string | null) => {
    if (guestId && latestGuestId !== guestId) {
      setLatestGuestId(guestId);
      post(guestId);
    }
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
        setResult("success");
        setErrorStatusCode(null);
      })
      .catch((e) => {
        setResult("error");
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
        <CardContent
          className={clsx(classes.noPadding, classes.resultChipBase)}
        >
          <QRScanner onScanFunc={handleGuestIdScan} videoStop={false} />
          {/* Result Chip */}
          {result && (
            <span className={classes.resultChip}>
              <ResultChip
                color={result}
                message={`退場${
                  result === "success" ? "成功" : "失敗"
                } / ゲスト ID: ${latestGuestId}`}
                onDelete={() => {
                  setResult(null);
                }}
              />
            </span>
          )}
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
