import React, { useCallback, useEffect, useState } from "react";
import CongestionHeatMap, {
  CongestionExample,
} from "components/CongestionHeatMap";
import { useTitleSet } from "libs/title";
import api, { AllStatus } from "@afes-website/docs";
import aspida from "@aspida/axios";
import moment, { Moment } from "moment";
import ReloadButton from "components/ReloadButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core";

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
      flexDirection: "row-reverse",
      marginTop: theme.spacing(2),
    },
  })
);

const HeatMap: React.VFC = () => {
  useTitleSet("混雑状況ヒートマップ");

  const classes = useStyles();

  const [exhStatus, setExhStatus] = useState<AllStatus | null>(null);
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
      <CongestionHeatMap exhStatus={exhStatus} />
      <div className={classes.bottom}>
        <CongestionExample />
      </div>
    </div>
  );
};

export default HeatMap;
