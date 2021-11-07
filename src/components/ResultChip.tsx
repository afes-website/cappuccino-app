import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import clsx from "clsx";
import { Chip, Fade, SvgIcon } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { CheckCircleOutline, ErrorOutline } from "@material-ui/icons";
import { StatusColor } from "types/statusColor";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      color: "#fff",
      "& .MuiChip-icon, .MuiChip-deleteIcon": {
        color: "#fff",
      },
    },
    success: {
      backgroundColor: theme.palette.success.main,
    },
    error: {
      backgroundColor: theme.palette.error.main,
    },
  })
);

export type ResultChipColors = Extract<StatusColor, "success" | "error">;

export interface ResultChipRefs {
  open: (
    color: ResultChipColors,
    message: string,
    duration?: number | null
  ) => void;
  close: () => void;
}
export interface ResultChipProps {
  className?: string;
}

const getResultIcon = (
  color: ResultChipColors | null
): React.ReactElement<typeof SvgIcon> => {
  if (!color) return <SvgIcon />;
  return color === "success" ? <CheckCircleOutline /> : <ErrorOutline />;
};

const ResultChipRenderFunction: React.ForwardRefRenderFunction<
  ResultChipRefs,
  ResultChipProps
> = (props, ref) => {
  const classes = useStyles();

  const [chipStatus, setChipStatus] = useState<
    "triggered" | "opened" | "closed"
  >("closed");
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const [color, setColor] = useState<ResultChipColors | null>(null);
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState<number | null>(null);

  useImperativeHandle(ref, () => {
    return {
      open: (
        color: ResultChipColors,
        message: string,
        duration?: number | null
      ) => {
        setColor(color);
        setMessage(message);
        setDuration(duration || null);
        setChipStatus("triggered");

        if (timeoutId) {
          window.clearTimeout(timeoutId);
          setTimeoutId(null);
        }
      },
      close: () => {
        setChipStatus("closed");
      },
    };
  });

  useEffect(() => {
    if (chipStatus === "triggered") {
      setChipStatus("opened");

      if (duration) {
        setTimeoutId(
          window.setTimeout(() => {
            setChipStatus("closed");
          }, duration)
        );
      }
    }
  }, [chipStatus, duration]);

  return (
    color && (
      <Fade
        in={chipStatus === "opened"}
        timeout={{ appear: 0, enter: 200, exit: 0 }}
      >
        <Chip
          icon={getResultIcon(color)}
          label={message}
          className={clsx(
            classes.root,
            color === "success" ? classes.success : classes.error,
            props.className
          )}
        />
      </Fade>
    )
  );
};

const ResultChip = forwardRef<ResultChipRefs, ResultChipProps>(
  ResultChipRenderFunction
);

export default ResultChip;
