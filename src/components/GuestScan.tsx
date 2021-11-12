import React, { useEffect, useRef, useState } from "react";
import { Guest } from "@afes-website/docs";
import clsx from "clsx";
import moment from "moment";
import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { CheckCircle, Face } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import CardList from "components/CardList";
import DirectInputFab from "components/DirectInputFab";
import DirectInputModal from "components/DirectInputModal";
import ErrorAlert from "components/ErrorAlert";
import QRScanner from "components/QRScanner";
import ResultChip, { ResultChipRefs } from "components/ResultChip";
import { ExhStatusCard } from "components/StayStatusCard";
import { useAuthState } from "hooks/auth/useAuth";
import {
  useBulkUpdateDispatch,
  useBulkUpdateState,
} from "hooks/bulkUpdate/useBulkUpdate";
import useErrorHandler, { isConnectionError } from "hooks/useErrorHandler";
import { StatusColor } from "types/statusColor";

const useStyles = makeStyles((theme) =>
  createStyles({
    list: {
      marginBottom: theme.spacing(2) + 48,
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
      bottom: theme.spacing(2) - 2,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 10,
    },
    progressWrapper: {
      position: "relative",
    },
    progress: {
      position: "absolute",
      top: -6,
      left: -6,
      zIndex: 10,
    },
    successIcon: {
      color: theme.palette.success.main,
    },
  })
);

type Page = `exhibition/${"enter" | "exit"}` | "executive/check-out";

interface Props {
  handleScan: (guestId: string) => Promise<Guest>;
  extraStatus?: StatusColor;
  additionalContent?: React.ReactNode;
  page: Page;
}

const GuestScan: React.VFC<Props> = ({
  handleScan,
  page,
  extraStatus,
  additionalContent,
}) => {
  const classes = useStyles();
  const resultChipRef = useRef<ResultChipRefs>(null);
  const { currentUserId } = useAuthState();
  const { onLine } = useBulkUpdateState();
  const { pushQuery } = useBulkUpdateDispatch();

  const [latestGuestId, setLatestGuestId] = useState("");
  const [opensGuestInputModal, setOpensGuestInputModal] = useState(false);
  const [checkStatus, setCheckStatus] = useState<StatusColor | null>(null);

  // エラー処理
  const [errorMessage, setError] = useErrorHandler();

  const isExh = page.split("/")[0] === "exhibition";

  const actionName = ((): string => {
    switch (page) {
      case "exhibition/enter":
        return "入室";
      case "exhibition/exit":
        return "退室";
      case "executive/check-out":
        return "退場";
    }
  })();

  const commandName = (() => {
    switch (page) {
      case "exhibition/enter":
        return "enter";
      case "exhibition/exit":
        return "exit";
      case "executive/check-out":
        return "check-out";
    }
  })();

  const pushBulkQuery = (guestId: string) => {
    pushQuery({
      command: commandName,
      guest_id: guestId,
      userId: currentUserId ?? "",
      timestamp: moment().toISOString(),
    });
  };

  const handleGuestIdScan = async (guestId: string) => {
    if (checkStatus !== "loading") {
      setCheckStatus("loading");
      setLatestGuestId(guestId);
      if (onLine) {
        try {
          await handleScan(guestId);
          setCheckStatus("success");
        } catch (e) {
          setError(e);
          if (isConnectionError(e)) {
            setCheckStatus("warning");
            pushBulkQuery(guestId);
          } else {
            setCheckStatus("error");
          }
        }
      } else {
        setCheckStatus("warning");
        setError("OFFLINE");
        pushBulkQuery(guestId);
      }
    }
  };

  useEffect(() => {
    switch (checkStatus) {
      case "loading":
        if (resultChipRef.current) resultChipRef.current.close();
        setError(null);
        break;
      case "success":
        setTimeout(() => {
          setCheckStatus(null);
          setLatestGuestId("");
        }, 3000);
        if (resultChipRef.current)
          resultChipRef.current.open(
            "success",
            `${actionName}成功 / ゲスト ID: ${latestGuestId}`,
            3000
          );
        break;
      case "warning":
        setTimeout(() => {
          setCheckStatus(null);
          setLatestGuestId("");
        }, 3000);
        if (resultChipRef.current)
          resultChipRef.current.open(
            "warning",
            `${actionName}記録 / ゲスト ID: ${latestGuestId}`,
            3000
          );
        break;
      case "error":
        if (resultChipRef.current)
          resultChipRef.current.open(
            "error",
            `${actionName}失敗 / ゲスト ID: ${latestGuestId}`
          );
        break;
    }
  }, [checkStatus, latestGuestId, actionName, setError]);

  return (
    <div>
      <Grid container className={classes.list}>
        <Grid item xs={12} md={6}>
          <CardList>
            {/* QR Scanner */}
            <Card>
              <CardContent
                className={clsx(classes.noPadding, classes.resultChipBase)}
              >
                <QRScanner
                  onScanFunc={handleGuestIdScan}
                  videoStop={false}
                  color={checkStatus ?? extraStatus ?? undefined}
                />
                {/* Result Chip */}
                <ResultChip
                  ref={resultChipRef}
                  className={classes.resultChip}
                />
              </CardContent>
            </Card>

            {!onLine && (
              <Card>
                <CardContent className={classes.noPadding}>
                  <Alert severity="warning">
                    <Typography variant="body2" key={0}>
                      スキャン情報はアプリに記録され、オンラインになった際にまとめて送信されます。
                    </Typography>
                    <Typography variant="body2" key={1}>
                      展示内の混雑状況を自分で確認しながらスキャンしてください。
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            )}

            {/* Error Alert */}
            {errorMessage && (
              <Card>
                <CardContent className={classes.noPadding}>
                  <ErrorAlert warning={!onLine} errorMessage={errorMessage} />
                </CardContent>
              </Card>
            )}

            {additionalContent}
          </CardList>
        </Grid>

        <Grid item xs={12} md={6}>
          <CardList>
            {/* ID List */}
            <Card>
              <CardContent className={classes.noPadding}>
                <List>
                  <ListItem>
                    <ListItemIcon className={classes.progressWrapper}>
                      {checkStatus === "success" ? (
                        <CheckCircle className={classes.successIcon} />
                      ) : (
                        <Face />
                      )}
                      {checkStatus === "loading" && (
                        <CircularProgress
                          className={classes.progress}
                          size={36}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={latestGuestId ? latestGuestId : "-"}
                      secondary="ゲスト ID (リストバンド ID)"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
            {isExh && <ExhStatusCard />}
          </CardList>
        </Grid>
      </Grid>

      {/* 直接入力ボタン */}
      <DirectInputFab
        onClick={() => {
          setOpensGuestInputModal(true);
        }}
        disabled={checkStatus === "loading"}
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

export default GuestScan;
