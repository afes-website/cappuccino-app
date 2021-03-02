import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import QrReader from "react-qr-reader";

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
    hideDefaultStyle: {
      "& *": {
        border: "none !important",
        boxShadow: "none !important",
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
      borderColor: "#fff",
      borderWidth: 4,
      borderRadius: 12,
      position: "relative",
      top: -4,
      left: -4,
      width: "100%",
      height: "100%",
    },
  })
);

interface Props {
  onScanFunc: (data: string | null) => void;
  videoStop: boolean;
}

const errorHandler = (err: unknown) => {
  // TODO: 画面に表示
  console.log(err);
};

const QRScanner: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        <QrReader
          onScan={props.onScanFunc}
          onError={errorHandler}
          delay={props.videoStop ? false : 500}
          className={classes.hideDefaultStyle}
        />
        <div className={classes.shadowBox}>
          <div className={classes.borderBox} />
        </div>
      </div>
    </>
  );
};

export default QRScanner;
