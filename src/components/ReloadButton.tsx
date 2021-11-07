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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
    },
    lastUpdated: {
      marginRight: theme.spacing(0.5),
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
        disabled={isLoading}
        onClick={() => {
          setIsLoading(true);
          onClick().finally(() => {
            setIsLoading(false);
          });
        }}
        startIcon={
          isLoading ? (
            <CircularProgress color="inherit" size={12} thickness={5} />
          ) : (
            <Refresh />
          )
        }
      >
        再読み込み
      </Button>
      {lastUpdated && (
        <Typography
          align="right"
          variant="body2"
          color="textSecondary"
          className={classes.lastUpdated}
        >
          最終更新: {lastUpdated.format("M/D HH:mm:ss")}
        </Typography>
      )}
    </Box>
  );
};

export default ReloadButton;
