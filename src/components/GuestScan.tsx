import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { AuthContext } from "@/libs/auth";
import clsx from "clsx";
import isAxiosError from "@/libs/isAxiosError";
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

type Page = `exh/${"enter" | "exit"}` | "general/exit";

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
  const [checkStatus, setCheckStatus] = useState<QRScannerColors | null>(null);
  const [errorStatusCode, setErrorStatusCode] = useState<StatusCode | null>(
    null
  );
  const [exhibitionName, setExhibitionName] = useState<string | null>(null);

  const isExh = useCallback((): boolean => props.page.split("/")[0] === "exh", [
    props.page,
  ]);

  const getActionName = useCallback(() => {
    switch (props.page) {
      case "exh/enter":
        return "入室";
      case "exh/exit":
        return "退室";
      case "general/exit":
        return "退場";
    }
  }, [props.page]);

  useEffect(() => {
    if (isExh()) setExhibitionName(auth.get_current_user()?.name || "-");
  }, [setExhibitionName, auth, isExh]);

  const handleGuestIdScan = (guestId: string | null) => {
    if (guestId && guestId !== latestGuestId && checkStatus !== "loading") {
      setCheckStatus("loading");
      if (resultChipRef.current) resultChipRef.current.close();
      setLatestGuestId(guestId);
      props
        .handleScan(guestId)
        .then(() => {
          setCheckStatus("success");
          if (resultChipRef.current)
            resultChipRef.current.open(
              "success",
              `${getActionName()}成功 / ゲスト ID: ${guestId}`,
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
              `${getActionName()}失敗 / ゲスト ID: ${guestId}`
            );
        });
    }
  };

  return (
    <div>
      <CardList className={classes.list}>
        {/* 展示名 */}
        {isExh() && (
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

export default GuestScan;
