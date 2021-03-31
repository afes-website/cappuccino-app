import React from "react";
import { Fab, FabProps, SvgIcon } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    bottomButton: {
      position: "fixed",
      right: "16px",
      bottom: "calc(env(safe-area-inset-bottom) + 72px)",
      zIndex: 500,
      "&.Mui-disabled":
        theme.palette.type === "light"
          ? {
              color: "#a6a6a6",
              background: "#e0e0e0",
            }
          : {
              color: "#8b8b8b",
              background: "#595959",
            },
    },
    fabLabel: {
      marginLeft: "8px",
    },
  })
);

export interface RightBottomFabProps {
  icon: React.ReactElement<typeof SvgIcon>;
  label?: string;
}

const RightBottomFab: React.FC<
  RightBottomFabProps & Omit<FabProps, "children">
> = (props) => {
  const classes = useStyles();
  const { icon, label, ...fabProps } = props;

  return (
    <Fab
      color="primary"
      variant="extended"
      className={classes.bottomButton}
      {...fabProps}
    >
      {props.icon}
      {props.label && <span className={classes.fabLabel}>{props.label}</span>}
    </Fab>
  );
};

export default RightBottomFab;
