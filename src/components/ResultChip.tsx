import React, { useEffect, useState } from "react";
import { Chip, Fade, SvgIcon } from "@material-ui/core";
import { CheckCircleOutline, ErrorOutline } from "@material-ui/icons";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";

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

export type ResultChipColors = "success" | "error";

export interface ResultChipProps {
  onDelete?: () => void;
  color: ResultChipColors;
  message: string;
}

const getResultIcon = (
  color: ResultChipColors
): React.ReactElement<typeof SvgIcon> => {
  return color === "success" ? <CheckCircleOutline /> : <ErrorOutline />;
};

const ResultChip: React.FC<ResultChipProps> = (props) => {
  const classes = useStyles();
  const [fade, setFade] = useState(true);

  useEffect(() => {
    setFade(false);
  }, [props.color, props.message]);
  useEffect(() => {
    if (!fade) setFade(true);
  }, [fade]);

  return (
    <Fade in={fade} timeout={{ appear: 0, enter: 500, exit: 0 }}>
      <Chip
        onDelete={props.onDelete}
        icon={getResultIcon(props.color)}
        label={props.message}
        className={clsx(
          classes.root,
          props.color === "success" ? classes.success : classes.error
        )}
      />
    </Fade>
  );
};

export default ResultChip;
