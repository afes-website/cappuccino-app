import React, { useEffect, useState } from "react";
import QrReader from "react-qr-reader";
import clsx from "clsx";
import { CircularProgress, Fade, IconButton } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Settings } from "@material-ui/icons";
import ErrorDialog from "components/ErrorDialog";
import { CameraOff } from "components/MaterialSvgIcons";
import VideoDeviceSelectModal from "components/VideoDeviceSelectModal";
import { getDeviceIdFromStorage } from "libs/videoDeviceId";
import { StatusColor } from "types/statusColor";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: "relative",
      paddingTop: "100%",
      "& > *": {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
      },
    },
    shadowBox: {
      border: "solid",
      borderColor: "rgba(0, 0, 0, 0.6)",
      borderWidth: theme.spacing(8),
      boxSizing: "border-box",
    },
    borderBox: {
      border: "solid",
      borderWidth: 4,
      borderRadius: 12,
      position: "relative",
      top: -4,
      left: -4,
      width: "100%",
      height: "100%",
    },
    borderSuccess: {
      borderColor: theme.palette.success.main,
    },
    borderWarning: {
      animation: "$searching-animation-in-warning 1000ms infinite ease-out",
    },
    "@keyframes searching-animation-in-warning": {
      "0%": {
        borderColor: theme.palette.warning.main,
      },
      "50%": {
        borderColor: theme.palette.warning.light,
      },
      "100%": {
        borderColor: theme.palette.warning.main,
      },
    },
    borderError: {
      animation: "$searching-animation-in-error 1000ms infinite ease-out",
    },
    "@keyframes searching-animation-in-error": {
      "0%": {
        borderColor: theme.palette.error.main,
      },
      "50%": {
        borderColor: theme.palette.error.light,
      },
      "100%": {
        borderColor: theme.palette.error.main,
      },
    },
    borderLoading: {
      borderColor: theme.palette.afesLight.main,
      background: "rgba(0, 0, 0, 0.6)",
    },
    borderSearching: {
      animation: "$searching-animation 1000ms infinite ease-out",
    },
    "@keyframes searching-animation": {
      "0%": {
        borderColor: theme.palette.primary.main,
      },
      "50%": {
        borderColor: theme.palette.afesLight.main,
      },
      "100%": {
        borderColor: theme.palette.primary.main,
      },
    },
    loadingProgressWrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "& > *": {
        color: theme.palette.afesLight.main,
      },
    },
    scannerBackground: {
      background: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "& > *": {
        display: "block",
        width: 64,
        height: 64,
        color: "#fff",
      },
    },
    videoDeviceSelectButton: {
      color: "#fff",
      right: 0,
    },
  })
);

export interface QRScannerProps {
  onScanFunc: (data: string) => void;
  videoStop: boolean;
  color?: StatusColor;
  resetKey?: number;
}

const QRScanner: React.VFC<QRScannerProps> = ({
  onScanFunc,
  color,
  resetKey,
}) => {
  const classes = useStyles();

  const [lastRead, setLastRead] = useState<string | null>(null);
  const [videoDeviceId, setVideoDeviceId] = useState<string>(
    getDeviceIdFromStorage() || ""
  );
  const [videoDeviceModalOpen, setVideoDeviceModalOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogTitle, setErrorDialogTitle] = useState("");
  const [errorDialogMessage, setErrorDialogMessage] = useState<string[]>([]);
  const [scannerStatus, setScannerStatus] = useState<
    "loading" | "waiting" | "error"
  >("loading");
  const [showQrReader, setShowQrReader] = useState(true);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const [qrReaderMount, setQrReaderMount] = useState(false);

  useEffect(() => {
    if (!showQrReader) {
      setShowQrReader(true);
      setScannerStatus("loading");
    }
  }, [showQrReader]);

  useEffect(() => {
    setLastRead(null);
  }, [resetKey]);

  // out of memory の対策として、5 分ごとに react-qr-reader を unmount して、直後に mount している
  // Chrome: out of memory due to web worker. Chrome not kicking off GC · Issue #205 · JodusNodus/react-qr-reader
  // https://github.com/JodusNodus/react-qr-reader/issues/205
  useEffect(() => {
    const unmountQrReader = () => {
      setQrReaderMount(false);
      setScannerStatus("loading");
    };
    const intervalId = window.setInterval(unmountQrReader, 5 * 60 * 1000);
    return () => window.clearInterval(intervalId);
  }, []);
  useEffect(() => {
    if (!qrReaderMount) setQrReaderMount(true);
  }, [qrReaderMount]);

  const getBorderClassName = (color: StatusColor | undefined): string => {
    switch (color) {
      case "success":
        return classes.borderSuccess;
      case "warning":
        return classes.borderWarning;
      case "error":
        return classes.borderError;
      case "loading":
        return classes.borderLoading;
      default:
        return classes.borderSearching;
    }
  };

  const onScan = (data: string | null) => {
    if (data !== null && data !== lastRead) {
      setLastRead(data);
      onScanFunc(data);

      if (timeoutId !== null) window.clearTimeout(timeoutId);
      setTimeoutId(
        window.setTimeout(() => {
          setLastRead(null);
        }, 10000)
      );
    }
  };

  const errorHandler = (err: unknown) => {
    console.error(err);
    setScannerStatus("error");
    setErrorDialogTitle("カメラ起動失敗");
    let reason: string[];
    if (isDOMException(err)) {
      console.error(err.name, err.message);
      switch (err.name) {
        case "NotReadableError":
          reason = [
            "カメラが他のアプリケーションで使用されています。",
            "カメラアプリやビデオ通話を開いていたり、フラッシュライトが点灯していたりしませんか？",
          ];
          break;
        case "NotAllowedError":
          reason = [
            "カメラを使用する権限がありません。",
            "お使いのブラウザの設定を確認してください。",
          ];
          break;
        default:
          reason = ["原因不明のエラーです。"];
          break;
      }
      reason = [...reason, `[${err.name}]`, err.message];
      setErrorDialogMessage(reason);
    } else {
      setErrorDialogMessage(["原因不明のエラーです。"]);
    }
    setErrorDialogOpen(true);
  };

  return (
    <>
      <div className={classes.root}>
        {["loading", "error"].includes(scannerStatus) && (
          <div className={classes.scannerBackground}>
            {scannerStatus === "error" ? (
              <CameraOff />
            ) : (
              <CircularProgress size={64} />
            )}
          </div>
        )}
        {showQrReader && qrReaderMount && (
          <QrReader
            onScan={onScan}
            onError={errorHandler}
            onLoad={() => {
              setScannerStatus("waiting");
            }}
            delay={1}
            showViewFinder={false}
            facingMode="environment"
            constraints={{ deviceId: videoDeviceId, facingMode: "environment" }}
          />
        )}
        <div className={classes.shadowBox}>
          <div className={clsx(classes.borderBox, getBorderClassName(color))} />
        </div>
        <div className={classes.loadingProgressWrapper}>
          <Fade in={color === "loading"} timeout={{ enter: 500, exit: 0 }}>
            <CircularProgress size={64} />
          </Fade>
        </div>
        <div className={classes.videoDeviceSelectButton}>
          <IconButton
            color="inherit"
            onClick={() => {
              setVideoDeviceModalOpen(true);
            }}
          >
            <Settings />
          </IconButton>
        </div>
      </div>
      <VideoDeviceSelectModal
        open={videoDeviceModalOpen}
        setOpen={setVideoDeviceModalOpen}
        onChange={(deviceId) => {
          setVideoDeviceId(deviceId);
          setShowQrReader(false);
        }}
      />
      <ErrorDialog
        open={errorDialogOpen}
        title={errorDialogTitle}
        message={errorDialogMessage}
        onClose={() => {
          setErrorDialogOpen(false);
        }}
      />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDOMException = (val: any): val is DOMException => {
  if (!val) return false;
  return (
    typeof val === "object" &&
    typeof val.name === "string" &&
    typeof val.message === "string"
  );
};

export default QRScanner;
