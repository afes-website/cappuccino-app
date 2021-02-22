import React from "react";
import { Fab, SvgIcon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  bottomButton: {
    position: "fixed",
    right: "16px",
    bottom: "72px",
  },
  fabLabel: {
    marginLeft: "8px",
  },
});

export interface RightBottomFabProps {
  onClick: () => void;
  icon: React.ReactElement<typeof SvgIcon>;
  areaLabel?: string;
  label?: string;
}

const RightBottomFab: React.FC<RightBottomFabProps> = (props) => {
  const classes = useStyles();

  return (
    <Fab
      color="primary"
      variant="extended"
      area-label={props.areaLabel}
      className={classes.bottomButton}
      onClick={props.onClick}
    >
      {props.icon}
      {props.label && <span className={classes.fabLabel}>{props.label}</span>}
    </Fab>
  );
};

export default RightBottomFab;
