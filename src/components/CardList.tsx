import React, { PropsWithChildren } from "react";
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

const CardList: React.VFC<PropsWithChildren<{ className?: string }>> = ({
  children,
  ...props
}) => {
  const classes = useStyles();
  return <div className={clsx(classes.root, props.className)}>{children}</div>;
};

export default CardList;
