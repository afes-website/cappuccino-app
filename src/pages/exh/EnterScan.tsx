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
import { WristBand } from "@/components/MaterialSvgIcons";
import CardList from "@/components/CardList";
import QRScanner, { QRScannerColors } from "@/components/QRScanner";
import DirectInputModal from "@/components/DirectInputModal";
import DirectInputFab from "@/components/DirectInputFab";
import ResultChip, { ResultChipRefs } from "@/components/ResultChip";
import { useTitleSet } from "@/libs/title";
import { AuthContext, useVerifyPermission } from "@/libs/auth";
import isAxiosError from "@/libs/isAxiosError";
import api from "@afes-website/docs";
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

const EnterScan: React.FC = () => {
  useTitleSet("展示教室 入室スキャン");
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const resultChipRef = useRef<ResultChipRefs>(null);
  useVerifyPermission("exhibition");

  const [latestGuestId, setLatestGuestId] = useState("");
  const [opensGuestInputModal, setOpensGuestInputModal] = useState(false);
  const [checkStatus, setCheckStatus] = useState<QRScannerColors | null>(null);
  const [errorStatusCode, setErrorStatusCode] = useState<StatusCode | null>(
    null
  );
  const [exhibitionName, setExhibitionName] = useState<string | null>(null);

  useEffect(() => {
    setExhibitionName(auth.val.get_current_user()?.name || "-");
  }, [setExhibitionName, auth.val]);

  const handleGuestIdScan = (guestId: string | null) => {
    if (guestId && latestGuestId !== guestId) {
      setLatestGuestId(guestId);
      if (resultChipRef.current) resultChipRef.current.close();
      setCheckStatus("loading");
      setErrorStatusCode(null);
      api(aspida())
        .onsite.exhibition.enter.$post({
          body: {
            guest_id: guestId,
          },
          headers: {
            Authorization: "bearer " + auth.val.get_current_user()?.token,
          },
        })
        .then(() => {
          setCheckStatus("success");
          if (resultChipRef.current)
            resultChipRef.current.open(
              "success",
              `入室成功 / ゲスト ID: ${guestId}`,
              3000
            );
          setTimeout(() => {
            setCheckStatus(null);
            setLatestGuestId("");
          }, 3000);
        })
        .catch((e) => {
          setCheckStatus("error");
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
          if (isNetworkError) setErrorStatusCode("NETWORK_ERROR");
          if (resultChipRef.current)
            resultChipRef.current.open(
              "error",
              `入室失敗 / ゲスト ID: ${guestId}`
            );
        });
    }
  };

  return (
    <div>
      <CardList className={classes.list}>
        <Card>
          <Alert severity="info">{`展示名: ${exhibitionName}`}</Alert>
        </Card>

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
    case "GUEST_ALREADY_ENTERED":
      return "来場者は既に入室済みで、まだ退室していません。";
    case "PEOPLE_LIMIT_EXCEEDED":
      return "展示の人数制限に達しています。";
    case "GUEST_ALREADY_EXITED":
      return "来場者は既に退場済みです。";
    case "EXIT_TIME_EXCEEDED":
      return "来場者は既に退場予定時刻を過ぎています。";
    case "EXHIBITION_NOT_FOUND":
      return "展示が存在しません。総務局にお問い合わせください。";
    case "NETWORK_ERROR":
      return "通信エラーが発生しました。通信環境を確認し、はじめからやり直してください。状況が改善しない場合は、総務局にお問い合わせください。";
  }
};

const statusCodeList = [
  "GUEST_NOT_FOUND",
  "GUEST_ALREADY_ENTERED",
  "PEOPLE_LIMIT_EXCEEDED",
  "GUEST_ALREADY_EXITED",
  "EXIT_TIME_EXCEEDED",
  "EXHIBITION_NOT_FOUND",
  "NETWORK_ERROR",
] as const;

type StatusCode = typeof statusCodeList[number];

export default EnterScan;
