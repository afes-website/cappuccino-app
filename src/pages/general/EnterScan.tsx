import React, { useState, useContext, useEffect, useRef } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import {
  Assignment,
  CheckCircle,
  ConfirmationNumber,
  Replay,
} from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import QRScanner from "@/components/QRScanner.";
import DirectInputModal from "@/components/DirectInputModal";
import DirectInputFab from "@/components/DirectInputFab";
import ResultChip, { ResultChipRefs } from "@/components/ResultChip";
import ResultPopup, {
  ResultPopupRefs,
  ResultPopupColors,
} from "@/components/ResultPopup";
import { useTitleSet } from "@/libs/title";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import { AuthContext } from "@/libs/auth";
import isAxiosError from "@/libs/isAxiosError";
import clsx from "clsx";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
      // TODO: margin 方式の変更
      // "& > * + *": {
      //   marginTop: "10px",
      // },
      marginBottom: theme.spacing(2) + 48,
    },
    noPadding: {
      padding: "0 !important",
      objectFit: "cover",
    },
    bottomButton: {
      marginTop: "10px",
      width: "100%",
    },
    resultChipBase: {
      position: "relative",
    },
    resultChip: {
      position: "absolute",
      bottom: theme.spacing(1),
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

const EnterScan: React.FC = () => {
  useTitleSet("入場処理");
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const resultPopupRef = useRef<ResultPopupRefs>(null);
  const resultChipRef = useRef<ResultChipRefs>(null);

  // ==== state ====

  // 最後に読み込んだ予約ID・ゲストID
  const [latestRsvId, setLatestRsvId] = useState("");
  const [latestGuestId, setLatestGuestId] = useState("");
  // 直接入力モーダルの開閉状態
  const [opensRsvInputModal, setOpensRsvInputModal] = useState(false);
  const [opensGuestInputModal, setOpensGuestInputModal] = useState(false);
  // ステップ管理
  const [activeScanner, setActiveScanner] = useState<"rsv" | "guest">("rsv");
  // 最新のAPI通信で発生したエラーステータスコード
  const [errorStatusCode, setErrorStatusCode] = useState<StatusCode | null>(
    null
  );
  // 予約ID・ゲストIDそれぞれのチェック結果
  const [
    rsvCheckStatus,
    setRsvCheckStatus,
  ] = useState<ResultPopupColors | null>(null);
  const [
    guestCheckStatus,
    setGuestCheckStatus,
  ] = useState<ResultPopupColors | null>(null);
  // 予約IDチェック・ゲストIDチェックをマージした全体のチェック結果
  // useEffect で自動更新
  const [
    totalCheckStatus,
    setTotalCheckStatus,
  ] = useState<ResultPopupColors | null>(null);

  // 全体のチェック結果の更新処理
  useEffect(() => {
    if (rsvCheckStatus === "success" && guestCheckStatus === "success")
      setTotalCheckStatus("success");
    else if (rsvCheckStatus === "loading" || guestCheckStatus === "loading")
      setTotalCheckStatus("loading");
    else if (rsvCheckStatus === "error" || guestCheckStatus === "error")
      setTotalCheckStatus("error");
    else setTotalCheckStatus(null);
  }, [rsvCheckStatus, guestCheckStatus]);

  // 全リセット
  const clearAll = () => {
    setLatestRsvId("");
    setLatestGuestId("");
    setOpensRsvInputModal(false);
    setOpensGuestInputModal(false);
    setActiveScanner("rsv");
    setErrorStatusCode(null);
    setRsvCheckStatus(null);
    setGuestCheckStatus(null);
    if (resultChipRef.current) resultChipRef.current.close();
  };

  const handleScan = (data: string | null) => {
    switch (activeScanner) {
      case "rsv":
        handleRsvIdScan(data);
        break;
      case "guest":
        handleGuestIdScan(data);
        break;
    }
  };

  const handleRsvIdScan = (rsvId: string | null) => {
    // null check & 二重スキャン防止
    if (
      rsvId !== null &&
      rsvId !== latestRsvId &&
      (rsvCheckStatus === null || rsvCheckStatus === "error")
    ) {
      setLatestRsvId(rsvId);
      // circular loading 表示
      setRsvCheckStatus("loading");
      // error alert 非表示
      setErrorStatusCode(null);
      // result chip 非表示
      if (resultChipRef.current) resultChipRef.current.close();
      // rsv id 検証
      api(aspida())
        .onsite.reservation._id(rsvId)
        .check.$get({
          headers: {
            Authorization: "bearer " + auth.val.get_current_user()?.token,
          },
        })
        .then((res) => {
          if (res.valid) {
            // 有効 : 次に進む
            setRsvCheckStatus("success");
            setActiveScanner("guest");
            if (resultChipRef.current)
              resultChipRef.current.open(
                "success",
                `予約確認成功 / 予約 ID: ${rsvId}`,
                3000
              );
          } else if (
            res.status_code &&
            (statusCodeList as ReadonlyArray<string>).includes(res.status_code)
          ) {
            // 無効 : 止める
            setRsvCheckStatus("error");
            if (resultChipRef.current)
              resultChipRef.current.open(
                "error",
                `予約確認失敗 / 予約 ID: ${rsvId}`
              );
            setErrorStatusCode(res.status_code as StatusCode);
          }
        })
        .catch((e) => {
          setRsvCheckStatus("error");
          if (resultChipRef.current)
            resultChipRef.current.open(
              "error",
              `予約確認失敗 / 予約 ID: ${rsvId}`
            );
          // 404 の場合
          if (isAxiosError(e) && e.response?.status === 404)
            setErrorStatusCode("RESERVATION_NOT_FOUND");
          // TODO: 404 以外のエラーハンドリング
        });
    }
  };

  const handleGuestIdScan = (guestId: string | null) => {
    // null check & 二重スキャン防止
    if (
      guestId !== null &&
      guestId !== latestGuestId &&
      guestId !== latestRsvId &&
      (guestCheckStatus === null || guestCheckStatus === "error")
    ) {
      setLatestGuestId(guestId);
      setGuestCheckStatus("loading");
      // error alert 非表示
      setErrorStatusCode(null);
      // result chip 非表示
      if (resultChipRef.current) resultChipRef.current.close();
      // ポップアップを開く
      if (resultPopupRef.current) resultPopupRef.current.open();
      // guest id 検証 (rsv id は有効性を確認済)
      api(aspida())
        .onsite.general.enter.$post({
          body: {
            reservation_id: latestRsvId,
            guest_id: guestId,
          },
          headers: {
            Authorization: "bearer " + auth.val.get_current_user()?.token,
          },
        })
        .then(() => {
          setRsvCheckStatus("success");
          setGuestCheckStatus("success");
          if (resultChipRef.current)
            resultChipRef.current.open(
              "success",
              `入場成功 / ゲスト ID: ${guestId}`
            );
        })
        .catch((e) => {
          if (
            isAxiosError(e) &&
            typeof e.response?.data.error_code === "string"
          ) {
            setErrorStatusCode(e.response?.data.error_code);
          }
          // TODO: 不明なエラーハンドリング
          setGuestCheckStatus("error");
          if (resultChipRef.current)
            resultChipRef.current.open(
              "error",
              `入場失敗 / ゲスト ID: ${guestId}`
            );
        });
    }
  };

  return (
    <div className={classes.root}>
      {/* QR Scanner */}
      <Card>
        <CardContent
          className={clsx(classes.noPadding, classes.resultChipBase)}
        >
          <QRScanner onScanFunc={handleScan} videoStop={false} />
          {/* Result Chip */}
          <ResultChip ref={resultChipRef} className={classes.resultChip} />
        </CardContent>
      </Card>

      {/* Error Alert */}
      {errorStatusCode && (
        <Card>
          <CardContent className={classes.noPadding}>
            <Alert severity="error">{getErrorMessage(errorStatusCode)}</Alert>
          </CardContent>
        </Card>
      )}

      {/* ID List */}
      <Card>
        <CardContent className={classes.noPadding}>
          <List>
            <ListItem disabled={activeScanner !== "rsv"}>
              <ListItemIcon className={classes.progressWrapper}>
                {rsvCheckStatus === "success" ? (
                  <CheckCircle className={classes.successIcon} />
                ) : (
                  <Assignment />
                )}
                {rsvCheckStatus === "loading" && (
                  <CircularProgress className={classes.progress} size={36} />
                )}
              </ListItemIcon>
              <ListItemText
                primary={latestRsvId ? latestRsvId : "-"}
                secondary="予約 ID"
              />
            </ListItem>
            <ListItem disabled={activeScanner !== "guest"}>
              <ListItemIcon>
                <ConfirmationNumber />
              </ListItemIcon>
              <ListItemText
                primary={latestGuestId ? latestGuestId : "-"}
                secondary="ゲスト ID (リストバンド)"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* 結果表示ポップアップ */}
      <ResultPopup
        status={totalCheckStatus}
        duration={2000}
        handleCloseOnSuccess={clearAll}
        ref={resultPopupRef}
      />

      {/* 直接入力するボタン */}
      <DirectInputFab
        onClick={() => {
          switch (activeScanner) {
            case "rsv":
              setOpensRsvInputModal(true);
              break;
            case "guest":
              setOpensGuestInputModal(true);
              break;
          }
        }}
      />

      {/* はじめからやり直すボタン */}
      {totalCheckStatus === "error" && (
        <Button
          variant="contained"
          color="primary"
          className={classes.bottomButton}
          startIcon={<Replay />}
          onClick={clearAll}
        >
          はじめからやり直す
        </Button>
      )}

      {/* 直接入力モーダル */}
      <DirectInputModal
        open={opensRsvInputModal}
        setOpen={setOpensRsvInputModal}
        onIdChange={handleRsvIdScan}
        currentId={latestRsvId}
        type="rsv"
      />
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

const getErrorMessage = (status_code: StatusCode): string => {
  switch (status_code) {
    case "INVALID_WRISTBAND_CODE":
      return "リストバンド ID の形式が間違っています。別のリストバンドを試してください。";
    case "ALREADY_USED_WRISTBAND":
      return "このリストバンドはすでに登録済みです。別のリストバンドを試してください。";
    case "RESERVATION_NOT_FOUND":
      return "該当する予約が見つかりませんでした。予約 ID を再確認し、権限の強い人を呼んでください。";
    case "INVALID_RESERVATION_INFO":
      return "予約情報に問題があります。予約 ID を再確認し、権限の強い人を呼んでください。";
    case "ALREADY_ENTERED_RESERVATION":
      return "この予約はすでに入場済みです。予約 ID を再確認し、権限の強い人を呼んでください。";
    case "OUT_OF_RESERVATION_TIME":
      return "この予約は入場時間外です。予約 ID を再確認し、権限の強い人を呼んでください。";
    case "WRONG_WRISTBAND_COLOR":
      return "リストバンドの色と退場予定時間が一致しません。リストバンドの種類をもう一度確認してください。";
  }
};

const statusCodeList = [
  "INVALID_WRISTBAND_CODE",
  "ALREADY_USED_WRISTBAND",
  "RESERVATION_NOT_FOUND",
  "INVALID_RESERVATION_INFO",
  "ALREADY_ENTERED_RESERVATION",
  "OUT_OF_RESERVATION_TIME",
  "WRONG_WRISTBAND_COLOR",
] as const;

type StatusCode = typeof statusCodeList[number];

export default EnterScan;
