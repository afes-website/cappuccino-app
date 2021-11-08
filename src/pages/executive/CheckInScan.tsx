import React, { useEffect, useRef, useState } from "react";
import api from "@afes-website/docs";
import clsx from "clsx";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { CheckCircle, Face, Replay } from "@material-ui/icons";
import CardList from "components/CardList";
import DirectInputFab from "components/DirectInputFab";
import DirectInputModal from "components/DirectInputModal";
import ErrorAlert from "components/ErrorAlert";
import { ReservationTicket } from "components/MaterialSvgIcons";
import QRScanner from "components/QRScanner";
import ResultChip, { ResultChipRefs } from "components/ResultChip";
import ResultPopup, { ResultPopupRefs } from "components/ResultPopup";
import TicketHeader from "components/TicketHeader";
import { useAspidaClient, useAuthState } from "hooks/auth/useAuth";
import { useRequirePermission } from "hooks/auth/useRequirePermission";
import useCheckRsv from "hooks/useCheckRsv";
import useErrorHandler from "hooks/useErrorHandler";
import useHandleRsvInput from "hooks/useHandleRsvInput";
import useReset from "hooks/useReset";
import useWristBandPaletteColor from "hooks/useWristBandColor";
import { useTitleSet } from "libs/title";
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
    bottomButton: {
      width: "100%",
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
    previousGuestInfoTitle: {
      paddingBottom: 0,
    },
    largeNumber: {
      fontSize: 24,
      marginLeft: 4,
    },
    limitOver: {
      color: theme.palette.error.main,
    },
    termColorBadge: {
      display: "inline-block",
      width: 12,
      height: 12,
      borderRadius: 6,
      marginBottom: -1,
      marginRight: theme.spacing(0.75),
    },
  })
);

const CheckInScan: React.VFC = () => {
  useTitleSet("文化祭 入場スキャン");
  useRequirePermission("executive");
  const classes = useStyles();
  const aspida = useAspidaClient();
  const { currentUser } = useAuthState();

  const wristBandPaletteColor = useWristBandPaletteColor();
  const resultPopupRef = useRef<ResultPopupRefs>(null);
  const resultChipRef = useRef<ResultChipRefs>(null);

  // ==== state ====

  const [latestGuestId, setLatestGuestId] = useState("");
  const [checkedInGuestIds, setCheckedInGuestIds] = useState<string[]>([]);
  const [directInputModalOpen, setDirectInputModalOpen] = useState(false);
  const [activeScanner, setActiveScanner] = useState<"rsv" | "guest">("rsv");
  const [rsvCheckStatus, setRsvCheckStatus] = useState<StatusColor | null>(
    null
  );
  const [guestCheckStatus, setGuestCheckStatus] = useState<StatusColor | null>(
    null
  );
  const [errorMessage, setError, setErrorCode] = useErrorHandler();
  const [resetKey, reset] = useReset();

  const {
    latestRsvId,
    handleRsvScan,
    handleRsvIdDirectInput,
    init: initHandleRsvScan,
  } = useHandleRsvInput(setErrorCode, setRsvCheckStatus);

  const {
    latestRsv,
    checkRsv,
    init: initCheckRsv,
  } = useCheckRsv(setError, setErrorCode, setRsvCheckStatus);

  const totalCheckStatus: StatusColor | null = (() => {
    if (rsvCheckStatus === "success" && guestCheckStatus === "success")
      return "success";
    else if (rsvCheckStatus === "loading" || guestCheckStatus === "loading")
      return "loading";
    else if (rsvCheckStatus === "error" || guestCheckStatus === "error")
      return "error";
    else return null;
  })();

  // 全リセット
  const clearAll = () => {
    setLatestGuestId("");
    setCheckedInGuestIds([]);
    setDirectInputModalOpen(false);
    setActiveScanner("rsv");
    setError(null);
    setRsvCheckStatus(null);
    setGuestCheckStatus(null);
    initHandleRsvScan();
    initCheckRsv();
    reset();
    if (resultChipRef.current) resultChipRef.current.close();
  };

  const handleScan = (data: string) => {
    switch (activeScanner) {
      case "rsv":
        if (rsvCheckStatus === null || rsvCheckStatus === "error")
          handleRsvScan(data, (rsvId) => {
            checkRsv(rsvId, () => {
              setActiveScanner("guest");
            });
          });
        break;
      case "guest":
        handleGuestIdScan(data);
        break;
    }
  };

  const handleDirectInput = (id: string) => {
    switch (activeScanner) {
      case "rsv":
        if (rsvCheckStatus === null || rsvCheckStatus === "error")
          handleRsvIdDirectInput(id, (rsvId) => {
            checkRsv(rsvId, () => {
              setActiveScanner("guest");
            });
          });
        break;
      case "guest":
        handleGuestIdScan(id);
        break;
    }
  };

  useEffect(() => {
    switch (rsvCheckStatus) {
      case "loading":
        setError(null);
        initCheckRsv();
        if (resultChipRef.current) resultChipRef.current.close();
        break;
      case "success":
        if (resultChipRef.current)
          resultChipRef.current.open(
            "success",
            `予約確認成功 / 予約 ID: ${latestRsvId}`,
            3000
          );
        break;
      case "error":
        if (resultChipRef.current)
          resultChipRef.current.open(
            "error",
            `予約確認失敗 / 予約 ID: ${latestRsvId}`
          );
        break;
    }
  }, [rsvCheckStatus, latestRsvId, setError, initCheckRsv]);

  const handleGuestIdScan = (guestId: string) => {
    if (guestCheckStatus === null || guestCheckStatus === "error") {
      setLatestGuestId(guestId);
      setGuestCheckStatus("loading");
      // guest id 検証 (rsv id は有効性を確認済)
      api(aspida)
        .guests.check_in.$post({
          body: {
            reservation_id: latestRsvId,
            guest_id: guestId,
          },
          headers: {
            Authorization: "bearer " + currentUser?.token,
          },
        })
        .then(() => {
          setGuestCheckStatus("success");
        })
        .catch((e) => {
          setGuestCheckStatus("error");
          setError(e);
        });
    }
  };

  const handleSuccess = () => {
    if (
      latestRsv &&
      latestRsv.member_checked_in + 1 < latestRsv.member_all &&
      latestRsv.term.class !== "Parent"
    ) {
      checkRsv(latestRsvId, () => {
        setActiveScanner("guest");
      });
      setGuestCheckStatus(null);
      setCheckedInGuestIds((prev) => [latestGuestId, ...prev]);
      setLatestGuestId("");
      return;
    }
    clearAll();
  };

  useEffect(() => {
    switch (guestCheckStatus) {
      case "loading":
        setError(null);
        if (resultChipRef.current) resultChipRef.current.close();
        if (resultPopupRef.current) resultPopupRef.current.open();
        break;
      case "success":
        if (resultChipRef.current)
          resultChipRef.current.open(
            "success",
            `入場成功 / ゲスト ID: ${latestGuestId}`
          );
        break;
      case "error":
        if (resultChipRef.current)
          resultChipRef.current.open(
            "error",
            `入場失敗 / ゲスト ID: ${latestGuestId}`
          );
        break;
    }
  }, [guestCheckStatus, latestGuestId, setError]);

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
                  onScanFunc={handleScan}
                  videoStop={false}
                  color={
                    { rsv: rsvCheckStatus, guest: guestCheckStatus }[
                      activeScanner
                    ] ?? undefined
                  }
                  resetKey={resetKey}
                />
                {/* Result Chip */}
                <ResultChip
                  ref={resultChipRef}
                  className={classes.resultChip}
                />
              </CardContent>
            </Card>

            {/* Error Alert */}
            {errorMessage && (
              <Card>
                <CardContent className={classes.noPadding}>
                  <ErrorAlert errorMessage={errorMessage} />
                </CardContent>
              </Card>
            )}
          </CardList>
        </Grid>

        <Grid item xs={12} md={6} spacing={2}>
          <CardList>
            {/* ID List */}
            <Card>
              <TicketHeader rsv={latestRsv} />
              <CardContent className={classes.noPadding}>
                <List>
                  <ListItem disabled={activeScanner !== "rsv"}>
                    <ListItemIcon className={classes.progressWrapper}>
                      {rsvCheckStatus === "success" ? (
                        <CheckCircle className={classes.successIcon} />
                      ) : (
                        <ReservationTicket />
                      )}
                      {rsvCheckStatus === "loading" && (
                        <CircularProgress
                          className={classes.progress}
                          size={36}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={latestRsvId ? latestRsvId : "-"}
                      secondary="予約 ID"
                    />
                  </ListItem>
                  <ListItem disabled={activeScanner !== "guest"}>
                    <ListItemIcon>
                      <Face />
                    </ListItemIcon>
                    <ListItemText
                      primary={latestGuestId ? latestGuestId : "-"}
                      secondary="リストバンド ID"
                    />
                    {latestRsv && (
                      <ListItemSecondaryAction>
                        <Typography
                          display="inline"
                          className={clsx(
                            {
                              [classes.limitOver]:
                                latestRsv.member_checked_in >=
                                latestRsv.member_all,
                            },
                            classes.largeNumber
                          )}
                        >
                          {`${
                            latestRsv.term.class === "Parent"
                              ? 1
                              : latestRsv.member_checked_in + 1
                          } `}
                        </Typography>
                        <Typography display="inline">人目</Typography>
                        <Typography
                          display="inline"
                          className={classes.largeNumber}
                        >
                          {`/ ${
                            latestRsv.term.class === "Parent"
                              ? 1
                              : latestRsv.member_all
                          } `}
                        </Typography>
                        <Typography display="inline">人</Typography>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                  {checkedInGuestIds.map((guestId) => (
                    <ListItem disabled key={guestId}>
                      <ListItemIcon>
                        <CheckCircle className={classes.successIcon} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <>
                            {latestRsv && (
                              <span
                                className={classes.termColorBadge}
                                style={{
                                  background: wristBandPaletteColor(
                                    latestRsv.term.guest_type
                                  ).main,
                                }}
                              />
                            )}
                            {guestId}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* 中断して最初からやり直すボタン */}
            {(activeScanner !== "rsv" || totalCheckStatus === "error") && (
              <Button
                variant="text"
                color="secondary"
                className={classes.bottomButton}
                startIcon={<Replay />}
                onClick={clearAll}
              >
                {activeScanner === "rsv"
                  ? "最初からやり直す"
                  : "処理を終了し予約スキャンに戻る"}
              </Button>
            )}
          </CardList>
        </Grid>
      </Grid>

      {/* 結果表示ポップアップ */}
      <ResultPopup
        status={totalCheckStatus}
        duration={2000}
        handleCloseOnSuccess={handleSuccess}
        ref={resultPopupRef}
      />

      {/* 直接入力ボタン */}
      <DirectInputFab
        onClick={() => {
          setDirectInputModalOpen(true);
        }}
        disabled={
          { rsv: rsvCheckStatus, guest: guestCheckStatus }[activeScanner] ===
          "loading"
        }
      />

      {/* 直接入力モーダル */}
      <DirectInputModal
        open={directInputModalOpen}
        setOpen={setDirectInputModalOpen}
        onIdChange={handleDirectInput}
        currentId={{ rsv: latestRsvId, guest: latestGuestId }[activeScanner]}
        type={activeScanner}
      />
    </div>
  );
};

export default CheckInScan;
