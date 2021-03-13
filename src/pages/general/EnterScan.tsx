import React, { useState, useContext, useEffect, useRef } from "react";
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
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import {
  AccessTime,
  Assignment,
  CheckCircle,
  Replay,
} from "@material-ui/icons";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { WristBand } from "@/components/MaterialSvgIcons";
import CardList from "@/components/CardList";
import QRScanner from "@/components/QRScanner";
import DirectInputModal from "@/components/DirectInputModal";
import DirectInputFab from "@/components/DirectInputFab";
import ResultChip, { ResultChipRefs } from "@/components/ResultChip";
import ResultPopup, {
  ResultPopupRefs,
  ResultPopupColors,
} from "@/components/ResultPopup";
import UniversalErrorDialog from "@/components/UniversalErrorDialog";
import { useTitleSet } from "@/libs/title";
import { AuthContext, useVerifyPermission } from "@/libs/auth";
import isAxiosError from "@/libs/isAxiosError";
import { getStringDateTimeBrief, getStringTime } from "@/libs/stringDate";
import { useWristBandPaletteColor } from "@/libs/wristBandColor";
import api, { Guest, Term } from "@afes-website/docs";
import aspida from "@aspida/axios";
import clsx from "clsx";

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
  })
);

const EnterScan: React.FC = () => {
  useTitleSet("文化祭 入場スキャン");
  useVerifyPermission("general");
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
  // 最後にチェックした予約IDに紐付けられている Term
  const [termInfo, setTermInfo] = useState<Term | null>(null);
  // 前回入場したゲスト情報
  const [prevGuestInfo, setPrevGuestInfo] = useState<Guest | null>(null);
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
  // エラーダイアログ
  const [errorDialogTitle, setErrorDialogTitle] = useState("");
  const [errorDialogMessage, setErrorDialogMessage] = useState<string[]>([]);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

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
    setTermInfo(null);
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
      // rsv info 消去
      setTermInfo(null);
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
          // res.valid に関わらず無条件で Term 情報を取得
          setTermInfo(res.term);
          if (res.valid) {
            // 有効 : 次に進む
            setRsvCheckStatus("success");
            setTimeout(() => {
              setActiveScanner("guest");
            }, 500);
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
          if (isAxiosError(e) && e.response?.status === 404)
            // 404 の場合
            setErrorStatusCode("RESERVATION_NOT_FOUND");
          else networkErrorHandler(e);
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
        .then((guest) => {
          setRsvCheckStatus("success");
          setGuestCheckStatus("success");
          setPrevGuestInfo(guest);
          if (resultChipRef.current)
            resultChipRef.current.open(
              "success",
              `入場成功 / ゲスト ID: ${guestId}`
            );
        })
        .catch((e) => {
          let isNetworkError = true;
          if (isAxiosError(e)) {
            const errorCode: unknown = e.response?.data.error_code;
            if (
              typeof errorCode === "string" &&
              (statusCodeList as ReadonlyArray<string>).includes(errorCode)
            ) {
              setErrorStatusCode(errorCode as StatusCode);
              isNetworkError = false;
            }
          }
          if (isNetworkError) networkErrorHandler(e);
          setGuestCheckStatus("error");
          if (resultChipRef.current)
            resultChipRef.current.open(
              "error",
              `入場失敗 / ゲスト ID: ${guestId}`
            );
        });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const networkErrorHandler = (e: any): void => {
    console.error(e);
    if (isAxiosError(e)) {
      // axios error
      if (e.response?.status)
        // status code があるとき
        setErrorDialogMessage([
          "サーバーエラーが発生しました。",
          "総務局にお問い合わせください。",
          `status code: ${e.response?.status || "undefined"}`,
          e.message,
        ]);
      // ないとき
      else
        setErrorDialogMessage([
          "通信エラーが発生しました。",
          "通信環境を確認し、はじめからやり直してください。",
          "状況が改善しない場合は、総務局にお問い合わせください。",
          e.message,
        ]);
    }
    // なにもわからないとき
    else
      setErrorDialogMessage([
        "通信エラーが発生しました。",
        "通信環境を確認し、はじめからやり直してください。",
        "状況が改善しない場合は、総務局にお問い合わせください。",
      ]);
    setErrorDialogTitle("通信エラー発生");
    setErrorDialogOpen(true);
    setErrorStatusCode("NETWORK_ERROR");
  };

  return (
    <div>
      <CardList className={classes.list}>
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
            />
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
                  secondary={
                    <>
                      予約 ID
                      {termInfo && (
                        <>
                          {" • "}
                          <ReservationTermInfo term={termInfo} />
                        </>
                      )}
                    </>
                  }
                />
              </ListItem>
              <ListItem disabled={activeScanner !== "guest"}>
                <ListItemIcon>
                  <WristBand />
                </ListItemIcon>
                <ListItemText
                  primary={latestGuestId ? latestGuestId : "-"}
                  secondary="ゲスト ID (リストバンド)"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* はじめからやり直すボタン */}
        {(activeScanner !== "rsv" || totalCheckStatus === "error") && (
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

        {/* 前回入場したゲスト情報 */}
        {activeScanner === "rsv" && ["loading", null].includes(rsvCheckStatus) && (
          <Card>
            <CardContent
              className={clsx({
                [classes.previousGuestInfoTitle]: prevGuestInfo,
              })}
            >
              <Typography
                style={{ fontSize: 14 }}
                color="textSecondary"
                gutterBottom={true}
              >
                前回入場したゲスト情報
              </Typography>
              {!prevGuestInfo && (
                <Typography variant="caption" align="center">
                  まだゲストの文化祭入場処理をしていません。
                </Typography>
              )}
            </CardContent>
            {prevGuestInfo && <GuestInfoList guest={prevGuestInfo} />}
          </Card>
        )}
      </CardList>

      {/* 結果表示ポップアップ */}
      <ResultPopup
        status={totalCheckStatus}
        duration={2000}
        handleCloseOnSuccess={clearAll}
        ref={resultPopupRef}
      />

      {/* 直接入力ボタン */}
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

      {/* エラーダイアログ */}
      <UniversalErrorDialog
        open={errorDialogOpen}
        title={errorDialogTitle}
        message={errorDialogMessage}
        onClose={() => {
          setErrorDialogOpen(false);
        }}
      />
    </div>
  );
};

const GuestInfoList: React.FC<{ guest: Guest }> = (props) => (
  <List>
    <ListItem>
      <ListItemIcon>
        <WristBand />
      </ListItemIcon>
      <ListItemText primary={props.guest.id} secondary="ゲスト ID" />
    </ListItem>
    <Grid container spacing={0}>
      <Grid item xs={6}>
        <ListItem>
          <ListItemIcon>
            <AccessTime />
          </ListItemIcon>
          <ListItemText
            primary={getStringDateTimeBrief(props.guest.entered_at)}
            secondary="入場時刻"
          />
        </ListItem>
      </Grid>
      <Grid item xs={6}>
        <ListItem>
          <ListItemIcon>
            <AccessTime />
          </ListItemIcon>
          <ListItemText
            primary={
              props.guest.term.exit_scheduled_time
                ? getStringDateTimeBrief(props.guest.term.exit_scheduled_time)
                : "-"
            }
            secondary="退場予定時刻"
          />
        </ListItem>
      </Grid>
    </Grid>
  </List>
);

const ReservationTermInfo: React.FC<{ term: Term }> = (props) => {
  const wristBandColor = useWristBandPaletteColor();
  return (
    <span style={{ color: wristBandColor(props.term.guest_type).main }}>
      {props.term.guest_type + " "}
      {`(${getStringDateTimeBrief(props.term.enter_scheduled_time)}
      -
      ${getStringTime(props.term.exit_scheduled_time)})`}
    </span>
  );
};

const getErrorMessage = (status_code: StatusCode): string => {
  switch (status_code) {
    // reservation
    case "RESERVATION_NOT_FOUND":
      return "該当する予約が見つかりませんでした。予約 ID を再確認し、権限の強い人を呼んでください。";
    case "INVALID_RESERVATION_INFO":
      return "予約情報に問題があります。予約 ID を再確認し、権限の強い人を呼んでください。";
    case "OUT_OF_RESERVATION_TIME":
      return "この予約は入場時間外です。予約 ID を再確認し、権限の強い人を呼んでください。";
    case "ALREADY_ENTERED_RESERVATION":
      return "この予約はすでに入場済みです。予約 ID を再確認し、権限の強い人を呼んでください。";
    // guest (wristband)
    case "INVALID_WRISTBAND_CODE":
      return "リストバンド ID の形式が間違っています。別のリストバンドを試してください。";
    case "ALREADY_USED_WRISTBAND":
      return "このリストバンドはすでに登録済みです。別のリストバンドを試してください。";
    case "WRONG_WRISTBAND_COLOR":
      return "リストバンドの色と予約情報が一致しません。リストバンドの種類をもう一度確認してください。";
    case "NETWORK_ERROR":
      return "通信エラーが発生しました。通信環境を確認し、はじめからやり直してください。状況が改善しない場合は、総務局にお問い合わせください。";
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
  "NETWORK_ERROR",
] as const;

type StatusCode = typeof statusCodeList[number];

export default EnterScan;
