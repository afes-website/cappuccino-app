import React, { useCallback, useEffect, useState } from "react";
import CongestionHeatMap, {
  CongestionExample,
} from "components/CongestionHeatMap";
import { useTitleSet } from "libs/title";
import api, { AllStatus } from "@afes-website/docs";
import aspida from "@aspida/axios";
import moment, { Moment } from "moment";
import ReloadButton from "components/ReloadButton";
import {
  createStyles,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  makeStyles,
  Slider,
  Theme,
} from "@material-ui/core";
import { Settings } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    reloadButton: {
      marginBottom: theme.spacing(2),
    },
    bottom: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginTop: theme.spacing(2),
      "& > *": {
        color: theme.palette.text.secondary,
      },
      "& > * + *": {
        marginLeft: theme.spacing(2),
      },
    },
  })
);

const HeatMap: React.VFC = () => {
  useTitleSet("混雑状況ヒートマップ");

  const classes = useStyles();

  const [exhStatus, setExhStatus] = useState<AllStatus | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rotateDeg, setRotateDeg] = useState(-45);
  const [scaleY, setScaleY] = useState(0.7);
  const [lastUpdated, setLastUpdated] = useState<Moment | null>(null);

  const load = useCallback(
    () =>
      api(aspida())
        .exhibitions.$get()
        .then((allStatus) => {
          setExhStatus(allStatus);
          setLastUpdated(moment());
        }),
    []
  );

  useEffect(() => {
    load();
    const intervalId = setInterval(load, 30000);
    return () => clearInterval(intervalId);
  }, [load]);

  return (
    <div className={classes.root}>
      <ReloadButton
        onClick={load}
        lastUpdated={lastUpdated}
        className={classes.reloadButton}
      />
      <CongestionHeatMap
        exhStatus={exhStatus}
        rotateDeg={rotateDeg}
        scaleY={scaleY}
      />
      <div className={classes.bottom}>
        <CongestionExample />
        <IconButton
          color="inherit"
          size="small"
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          <Settings />
        </IconButton>
      </div>

      <Dialog
        maxWidth="xs"
        fullWidth
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
      >
        <DialogTitle>マップ表示設定</DialogTitle>
        <DialogContent>
          <DialogContentText>角度: {rotateDeg} 度</DialogContentText>
          <Slider
            defaultValue={rotateDeg}
            getAriaValueText={(val: number) => `${val}°`}
            valueLabelDisplay="auto"
            step={45}
            marks
            track={false}
            min={-180}
            max={180}
            onChange={(_, val) => {
              if (typeof val === "number") setRotateDeg(val);
            }}
            color="secondary"
          />
          <DialogContentText>拡大率 (Y方向): {scaleY} 倍</DialogContentText>
          <Slider
            defaultValue={scaleY}
            getAriaValueText={(val: number) => `${val} 倍`}
            valueLabelDisplay="auto"
            step={0.1}
            marks
            track={false}
            min={0.1}
            max={1.0}
            onChange={(_, val) => {
              if (typeof val === "number") setScaleY(val);
            }}
            color="secondary"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeatMap;
