import React from "react";
import { CircularProgress, Fade } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import QrReader from "react-qr-reader";
import { ResultPopupColors } from "@/components/ResultPopup";

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
  })
);

export type QRScannerColors = ResultPopupColors;

export interface QRScannerProps {
  onScanFunc: (data: string | null) => void;
  videoStop: boolean;
  color?: QRScannerColors;
}

const errorHandler = (err: unknown) => {
  // TODO: 画面に表示
  console.log(err);
};

const QRScanner: React.FunctionComponent<QRScannerProps> = (props) => {
  const classes = useStyles();

  const getBorderClassName = (color: QRScannerColors | undefined): string => {
    switch (color) {
      case "success":
        return classes.borderSuccess;
      case "error":
        return classes.borderError;
      case "loading":
        return classes.borderLoading;
      default:
        return classes.borderSearching;
    }
  };

  return (
    <>
      <div className={classes.root}>
        <QrReader
          onScan={props.onScanFunc}
          onError={errorHandler}
          delay={props.videoStop ? false : 500}
          showViewFinder={false}
        />
        <div className={classes.shadowBox}>
          <div
            className={clsx(classes.borderBox, getBorderClassName(props.color))}
          />
        </div>

        <div className={classes.loadingProgressWrapper}>
          <Fade
            in={props.color === "loading"}
            timeout={{ enter: 500, exit: 0 }}
          >
            <CircularProgress size={64} />
          </Fade>
        </div>
      </div>
    </>
  );
};

export default QRScanner;
