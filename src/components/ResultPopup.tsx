import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  Fade,
  Slide,
} from "@material-ui/core";
import { CheckCircleOutline, ErrorOutline } from "@material-ui/icons";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { TransitionProps } from "@material-ui/core/transitions";
import clsx from "clsx";

const useStyles = makeStyles((theme) =>
  createStyles({
    icon: {
      display: "block",
      width: 64,
      height: 64,
      margin: 0,
    },
    iconWrapper: {
      padding: 20,
    },
    success: {
      color: theme.palette.success.main,
    },
    error: {
      color: theme.palette.error.main,
    },
    progress: {
      margin: 5,
    },
  })
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export type ResultPopupColors = "success" | "error" | "loading";

export interface ResultPopupProps {
  status: ResultPopupColors | null;
  duration: number;
  handleCloseOnSuccess: () => void;
}

export interface ResultPopupRefs {
  open: () => void;
}

const ResultPopupRenderFunction: React.ForwardRefRenderFunction<
  ResultPopupRefs,
  ResultPopupProps
> = (props, ref) => {
  const classes = useStyles();
  const [dialogStatus, setDialogStatus] = useState<
    "triggered" | "opened" | "closed"
  >("closed");
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  // 閉じる処理
  const handleClose = useCallback((): void => {
    if (props.status === "success") props.handleCloseOnSuccess();
    if (props.status !== "loading") setDialogStatus("closed");
  }, [props]);

  // 起動処理
  useImperativeHandle(ref, () => {
    return {
      open: () => {
        setDialogStatus("triggered");
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
          setTimeoutId(null);
        }
      },
    };
  });

  // 開閉処理
  useEffect(() => {
    if (dialogStatus === "triggered" || dialogStatus === "opened") {
      // status が有効
      if (props.status !== null) {
        setDialogStatus("opened");

        // すでに結果が出ていたら、duration ms 後に閉じる
        if (props.status === "success" || props.status === "error")
          setTimeoutId(window.setTimeout(handleClose, props.duration));
      } else {
        // status が無効
        setDialogStatus("closed");
      }
    }
  }, [dialogStatus, props.status, props.duration, handleClose]);

  const StatusIcon: React.FC = () => {
    switch (props.status) {
      case "loading":
        return (
          <Fade in={true} timeout={{ enter: 1000, exit: 0 }}>
            <CircularProgress
              className={clsx(classes.icon, classes.progress)}
              size={54}
              thickness={5.1}
            />
          </Fade>
        );
      case "success":
        return (
          <Fade in={true} timeout={{ enter: 300, exit: 0 }}>
            <CheckCircleOutline
              className={clsx(classes.icon, classes.success)}
            />
          </Fade>
        );
      case "error":
        return (
          <Fade in={true} timeout={{ enter: 300, exit: 0 }}>
            <ErrorOutline className={clsx(classes.icon, classes.error)} />
          </Fade>
        );
    }
    return <></>;
  };

  return (
    <>
      <Dialog open={dialogStatus === "opened"} TransitionComponent={Transition}>
        <DialogContent className={classes.iconWrapper}>
          <StatusIcon />
        </DialogContent>
      </Dialog>
    </>
  );
};

const ResultPopup = forwardRef<ResultPopupRefs, ResultPopupProps>(
  ResultPopupRenderFunction
);

export default ResultPopup;
