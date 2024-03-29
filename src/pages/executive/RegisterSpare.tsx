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
  ListItemText,
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
import { useAspidaClient, useAuthState } from "hooks/auth/useAuth";
import { useRequirePermission } from "hooks/auth/useRequirePermission";
import useErrorHandler from "hooks/useErrorHandler";
import useHandleRsvInput from "hooks/useHandleRsvInput";
import useReset from "hooks/useReset";
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

const RegisterSpare: React.VFC = () => {
  useTitleSet("予備リストバンド登録");
  useRequirePermission("executive");
  const classes = useStyles();
  const aspida = useAspidaClient();
  const { currentUser } = useAuthState();

  const resultPopupRef = useRef<ResultPopupRefs>(null);
  const resultChipRef = useRef<ResultChipRefs>(null);

  // ==== state ====

  // 最後に読み込んだ予約ID・ゲストID
  const [latestGuestId, setLatestGuestId] = useState("");
  // 直接入力モーダルの開閉状態
  const [directInputModalOpen, setDirectInputModalOpen] = useState(false);
  // ステップ管理
  const [activeScanner, setActiveScanner] = useState<"rsv" | "guest">("rsv");
  // 予約ID・ゲストIDそれぞれのチェック結果
  const [rsvScanStatus, setRsvScanStatus] = useState<StatusColor | null>(null);
  const [registerStatus, setRegisterStatus] = useState<StatusColor | null>(
    null
  );
  // 予約IDチェック・ゲストIDチェックをマージした全体のチェック結果
  // useEffect で自動更新
  const [totalStatus, setTotalStatus] = useState<StatusColor | null>(null);
  // エラー処理
  const [errorMessage, setError, setErrorCode] = useErrorHandler();
  const [resetKey, reset] = useReset();

  const {
    latestRsvId,
    handleRsvScan,
    handleRsvIdDirectInput,
    init: initHandleRsvScan,
  } = useHandleRsvInput(setErrorCode, setRsvScanStatus);

  // 全体のチェック結果の更新処理
  useEffect(() => {
    if (rsvScanStatus === "success" && registerStatus === "success")
      setTotalStatus("success");
    else if (rsvScanStatus === "loading" || registerStatus === "loading")
      setTotalStatus("loading");
    else if (rsvScanStatus === "error" || registerStatus === "error")
      setTotalStatus("error");
    else setTotalStatus(null);
  }, [rsvScanStatus, registerStatus]);

  // 全リセット
  const clearAll = () => {
    setLatestGuestId("");
    setDirectInputModalOpen(false);
    setActiveScanner("rsv");
    setError(null);
    setRsvScanStatus(null);
    setRegisterStatus(null);
    initHandleRsvScan();
    reset();
    if (resultChipRef.current) resultChipRef.current.close();
  };

  const handleScan = (data: string) => {
    switch (activeScanner) {
      case "rsv":
        handleRsvScan(data, () => {
          setRsvScanStatus("success");
          setActiveScanner("guest");
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
        if (rsvScanStatus === null || rsvScanStatus === "error")
          handleRsvIdDirectInput(id);
        break;
      case "guest":
        handleGuestIdScan(id);
        break;
    }
  };

  useEffect(() => {
    switch (rsvScanStatus) {
      case "loading":
        setError(null);
        if (resultChipRef.current) resultChipRef.current.close();
        break;
      case "success":
        if (resultChipRef.current)
          resultChipRef.current.open(
            "success",
            `予約スキャン完了 / 予約 ID: ${latestRsvId}`,
            3000
          );
        break;
    }
  }, [rsvScanStatus, latestRsvId, setError]);

  const handleGuestIdScan = (guestId: string) => {
    if (registerStatus === null || registerStatus === "error") {
      setLatestGuestId(guestId);
      setRegisterStatus("loading");
      api(aspida)
        .guests.register_spare.$post({
          body: {
            reservation_id: latestRsvId,
            guest_id: guestId,
          },
          headers: {
            Authorization: "bearer " + currentUser?.token,
          },
        })
        .then(() => {
          setRegisterStatus("success");
        })
        .catch((e) => {
          setRegisterStatus("error");
          setError(e);
        });
    }
  };

  const handleSuccess = () => clearAll();

  useEffect(() => {
    switch (registerStatus) {
      case "loading":
        setError(null);
        if (resultChipRef.current) resultChipRef.current.close();
        if (resultPopupRef.current) resultPopupRef.current.open();
        break;
      case "success":
        if (resultChipRef.current)
          resultChipRef.current.open(
            "success",
            `登録成功 / ゲスト ID: ${latestGuestId}`
          );
        break;
      case "error":
        if (resultChipRef.current)
          resultChipRef.current.open(
            "error",
            `登録失敗 / ゲスト ID: ${latestGuestId}`
          );
        break;
    }
  }, [registerStatus, latestGuestId, setError]);

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
                    { rsv: rsvScanStatus, guest: registerStatus }[
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
              <CardContent className={classes.noPadding}>
                <List>
                  <ListItem disabled={activeScanner !== "rsv"}>
                    <ListItemIcon className={classes.progressWrapper}>
                      {rsvScanStatus === "success" ? (
                        <CheckCircle className={classes.successIcon} />
                      ) : (
                        <ReservationTicket />
                      )}
                      {rsvScanStatus === "loading" && (
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
                      secondary="ゲスト ID (リストバンド ID)"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* 中断して最初からやり直すボタン */}
            {(activeScanner !== "rsv" || totalStatus === "error") && (
              <Button
                variant="text"
                color="secondary"
                className={classes.bottomButton}
                startIcon={<Replay />}
                onClick={clearAll}
              >
                中断して最初からやり直す
              </Button>
            )}
          </CardList>
        </Grid>
      </Grid>

      {/* 結果表示ポップアップ */}
      <ResultPopup
        status={totalStatus}
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
          { rsv: rsvScanStatus, guest: registerStatus }[activeScanner] ===
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

export default RegisterSpare;
