import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { CheckCircle } from "@material-ui/icons";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { WristBand } from "components/MaterialSvgIcons";
import CardList from "components/CardList";
import QRScanner from "components/QRScanner";
import DirectInputModal from "components/DirectInputModal";
import DirectInputFab from "components/DirectInputFab";
import ResultChip, { ResultChipRefs } from "components/ResultChip";
import ErrorDialog from "components/ErrorDialog";
import { AuthContext } from "libs/auth";
import isAxiosError from "libs/isAxiosError";
import { StatusColor } from "types/statusColor";
import clsx from "clsx";
import { Guest } from "@afes-website/docs";

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
  page: Page;
}

const GuestScan: React.FC<Props> = (props) => {
  const classes = useStyles();
  const auth = useContext(AuthContext).val;
  const resultChipRef = useRef<ResultChipRefs>(null);

  const [latestGuestId, setLatestGuestId] = useState("");
  const [opensGuestInputModal, setOpensGuestInputModal] = useState(false);
  const [checkStatus, setCheckStatus] = useState<StatusColor | null>(null);
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);
  const [errorDialogTitle, setErrorDialogTitle] = useState("");
  const [errorDialogMessage, setErrorDialogMessage] = useState<string[]>([]);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [exhibitionName, setExhibitionName] = useState<string | null>(null);

  const isExh = props.page.split("/")[0] === "exh";

  const actionName = ((): string => {
    switch (props.page) {
      case "exhibition/enter":
        return "入室";
      case "exhibition/exit":
        return "退室";
      case "executive/check-out":
        return "退場";
    }
  })();

  useEffect(() => {
    if (isExh) setExhibitionName(auth.get_current_user()?.name || "-");
  }, [setExhibitionName, auth, isExh]);

  const handleGuestIdScan = (guestId: string | null) => {
    if (guestId && guestId !== latestGuestId && checkStatus !== "loading") {
      setCheckStatus("loading");
      setLatestGuestId(guestId);
      props
        .handleScan(guestId)
        .then(() => {
          setCheckStatus("success");
        })
        .catch((e) => {
          setCheckStatus("error");
          if (isAxiosError(e)) {
            const errorCode: unknown = e.response?.data.error_code;
            if (
              typeof errorCode === "string" &&
              (errorCodeList as ReadonlyArray<string>).includes(errorCode)
            ) {
              setErrorCode(errorCode as ErrorCode);
              return;
            }
          }
          networkErrorHandler(e);
        });
    }
  };

  useEffect(() => {
    switch (checkStatus) {
      case "loading":
        if (resultChipRef.current) resultChipRef.current.close();
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
      case "error":
        if (resultChipRef.current)
          resultChipRef.current.open(
            "error",
            `${actionName}失敗 / ゲスト ID: ${latestGuestId}`
          );
        break;
    }
  }, [checkStatus, latestGuestId, actionName]);

  const networkErrorHandler = (e: unknown): void => {
    console.error(e);
    setErrorDialogOpen(true);
    if (isAxiosError(e)) {
      // axios error
      if (e.response?.status) {
        // status code があるとき
        setErrorCode("SERVER_ERROR");
        setErrorDialogTitle("サーバーエラー");
        setErrorDialogMessage([
          "サーバーエラーが発生しました。",
          "総務局にお問い合わせください。",
          `status code: ${e.response?.status || "undefined"}`,
          e.message,
        ]);
      }
      // ないとき
      else {
        setErrorCode("NETWORK_ERROR");
        setErrorDialogTitle("通信エラー");
        setErrorDialogMessage([
          "通信エラーが発生しました。",
          "通信環境を確認し、はじめからやり直してください。",
          "状況が改善しない場合は、総務局にお問い合わせください。",
          e.message,
        ]);
      }
    }
    // なにもわからないとき
    else {
      setErrorCode("NETWORK_ERROR");
      setErrorDialogTitle("通信エラー");
      setErrorDialogMessage([
        "通信エラーが発生しました。",
        "通信環境を確認し、はじめからやり直してください。",
        "状況が改善しない場合は、総務局にお問い合わせください。",
      ]);
    }
  };

  return (
    <div>
      <CardList className={classes.list}>
        {/* 展示名 */}
        {isExh && (
          <Card>
            <Alert severity="info">{`展示名: ${exhibitionName}`}</Alert>
          </Card>
        )}

        {/* QR Scanner */}
        <Card>
          <CardContent
            className={clsx(classes.noPadding, classes.resultChipBase)}
          >
            <QRScanner
              onScanFunc={handleGuestIdScan}
              videoStop={false}
              color={checkStatus ?? undefined}
            />
            {/* Result Chip */}
            <ResultChip ref={resultChipRef} className={classes.resultChip} />
          </CardContent>
        </Card>

        {/* Error Alert */}
        {errorCode && (
          <Card>
            <CardContent className={classes.noPadding}>
              <Alert severity="error">{getErrorMessage(errorCode)}</Alert>
            </CardContent>
          </Card>
        )}

        {/* ID List */}
        <Card>
          <CardContent className={classes.noPadding}>
            <List>
              <ListItem>
                <ListItemIcon className={classes.progressWrapper}>
                  {checkStatus === "success" ? (
                    <CheckCircle className={classes.successIcon} />
                  ) : (
                    <WristBand />
                  )}
                  {checkStatus === "loading" && (
                    <CircularProgress className={classes.progress} size={36} />
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
      </CardList>

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

      {/* エラーダイアログ */}
      <ErrorDialog
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

const getErrorMessage = (status_code: ErrorCode) => {
  switch (status_code) {
    case "GUEST_NOT_FOUND":
      return "合致する来場者情報がありません。";
    case "GUEST_ALREADY_ENTERED":
      return "すでに入室処理が完了しています。";
    case "PEOPLE_LIMIT_EXCEEDED":
      return "すでに展示の滞在人数の上限に達しています。";
    case "GUEST_ALREADY_EXITED":
      return "来場者は一度麻布から退場しています。必要に応じて近くの統制局員・総務局員にお問い合わせください。";
    case "EXIT_TIME_EXCEEDED":
      return "来場者は既に退場予定時刻を過ぎています。";
    case "EXHIBITION_NOT_FOUND":
      return "内部エラーです。至急、総務局にお問い合わせください。（EXHIBITION_NOT_FOUND）";
    case "NETWORK_ERROR":
      return "通信エラーが発生しました。通信環境を確認し、はじめからやり直してください。状況が改善しない場合は、総務局にお問い合わせください。";
    case "SERVER_ERROR":
      return "サーバーエラーが発生しました。至急、総務局にお問い合わせください。";
  }
};

const errorCodeList = [
  "GUEST_NOT_FOUND",
  "GUEST_ALREADY_ENTERED",
  "PEOPLE_LIMIT_EXCEEDED",
  "GUEST_ALREADY_EXITED",
  "EXIT_TIME_EXCEEDED",
  "EXHIBITION_NOT_FOUND",
  "NETWORK_ERROR",
  "SERVER_ERROR",
] as const;

type ErrorCode = typeof errorCodeList[number];

export default GuestScan;
