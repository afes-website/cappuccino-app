import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1.5),
      "& > * + *": {
        marginTop: theme.spacing(1.5),
      },
    },
  })
);

const CardList: React.FC<{ children: React.ReactNode; className?: string }> = (
  props
) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>{props.children}</div>
  );
};

export default CardList;
