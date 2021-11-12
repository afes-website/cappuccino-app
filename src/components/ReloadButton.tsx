import React, { useState } from "react";
import clsx from "clsx";
import { Moment } from "moment";
import {
  Box,
  Button,
  CircularProgress,
  Theme,
  Typography,
  createStyles,
  makeStyles,
} from "@material-ui/core";
import { Refresh } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
    },
    lastUpdated: {
      marginRight: theme.spacing(0.5),
      display: "block",
      minWidth: 150,
    },
  })
);

interface Props {
  onClick: () => Promise<void>;
  lastUpdated?: Moment | null;
  className?: string;
}

const ReloadButton: React.VFC<Props> = ({
  onClick,
  lastUpdated,
  className,
}) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Box className={clsx(classes.root, className)}>
      <Button
        variant="text"
        color="secondary"
        size="small"
        disabled={!lastUpdated || isLoading}
        onClick={() => {
          setIsLoading(true);
          onClick().finally(() => {
            setIsLoading(false);
          });
        }}
        startIcon={
          !lastUpdated || isLoading ? (
            <CircularProgress color="inherit" size={12} thickness={5} />
          ) : (
            <Refresh />
          )
        }
      >
        再読み込み
      </Button>
      <Typography
        align="right"
        variant="body2"
        color="textSecondary"
        className={classes.lastUpdated}
      >
        {lastUpdated ? (
          `最終更新: ${lastUpdated.format("M/D HH:mm:ss")}`
        ) : (
          <Skeleton />
        )}
      </Typography>
    </Box>
  );
};

export default ReloadButton;
