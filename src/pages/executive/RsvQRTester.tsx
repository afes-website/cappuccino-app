import React, { useEffect, useRef, useState } from "react";
import { Card, Grid, List, ListItem, ListItemText } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import CardList from "components/CardList";
import QRScanner from "components/QRScanner";
import ResultChip, { ResultChipRefs } from "components/ResultChip";
import ErrorAlert from "components/ErrorAlert";
import { useRequirePermission } from "libs/auth/useRequirePermission";
import { useTitleSet } from "libs/title";
import useErrorHandler from "libs/useErrorHandler";
import { StatusColor } from "types/statusColor";
import { Reservation } from "@afes-website/docs";
import { parseReservation } from "libs/parser";

const useStyles = makeStyles((theme) =>
  createStyles({
    tabs: {
      background: theme.palette.background.default,
      paddingTop: theme.spacing(1),
    },
    list: {
      marginBottom: theme.spacing(2) + 48,
    },
    resultChipBase: {
      position: "relative",
    },
    resultChip: {
      position: "absolute",
      bottom: theme.spacing(2) - 2,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 10,
    },
    cardTitle: {
      paddingBottom: 0,
    },
    alertMessage: {
      display: "block",
    },
    termColorBadge: {
      display: "inline-block",
      width: 12,
      height: 12,
      borderRadius: 6,
      marginBottom: -1,
      marginRight: theme.spacing(0.75),
    },
  })
);

const RsvQRTester: React.VFC = () => {
  useTitleSet("予約QRテスター");
  useRequirePermission(["executive", "reservation"]);

  const classes = useStyles();
  const resultChipRef = useRef<ResultChipRefs>(null);

  // guest
  const [guestId, setGuestId] = useState<string>("");

  // reservation
  const [rsvInfo, setRsvInfo] = useState<Reservation | null>(null);
  const [json, setJson] = useState<string>("");

  const [status, setStatus] = useState<StatusColor | null>(null);

  // エラー処理
  const [errorMessage, setError] = useErrorHandler();

  const clearInfo = () => {
    // rsv
    setRsvInfo(null);
  };

  // モード切り替え時の初期化
  useEffect(() => {
    setGuestId("");
    clearInfo();

    // error
    setStatus(null);
    setError(null);
    if (resultChipRef.current) resultChipRef.current.close();
  }, [setError]);

  const handleScan = (value: string) => {
    setJson(value);
    setRsvInfo(parseReservation(value));
    if (resultChipRef.current)
      resultChipRef.current.open("success", "読み取り成功", 3000);
  };

  useEffect(() => {
    switch (status) {
      case "loading":
        clearInfo();
        setError(null);
        if (resultChipRef.current) resultChipRef.current.close();
        break;
      case "success":
        if (resultChipRef.current)
          resultChipRef.current.open("success", "読み取り成功", 3000);
        break;
      case "error":
        if (resultChipRef.current)
          resultChipRef.current.open("error", "読み取り失敗");
        break;
    }
  }, [status, guestId, setError]);

  return (
    <Grid container className={classes.list}>
      <Grid xs={12} md={6}>
        <CardList>
          <Card className={classes.resultChipBase}>
            <QRScanner
              onScanFunc={handleScan}
              videoStop={false}
              color={status || undefined}
            />
            {status && (
              <ResultChip ref={resultChipRef} className={classes.resultChip} />
            )}
          </Card>
          {errorMessage && (
            <Card>
              <ErrorAlert errorMessage={errorMessage} />
            </Card>
          )}
        </CardList>
      </Grid>
      <Grid xs={12} md={6}>
        <CardList>
          <List dense>
            <ListItem>
              <ListItemText primary={rsvInfo?.id} secondary="id" />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={rsvInfo?.member_all}
                secondary="member_all"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={rsvInfo?.member_checked_in}
                secondary="member_checked_in"
              />
            </ListItem>
            <ListItem>
              <ListItemText primary={rsvInfo?.term.id} secondary="term.id" />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={rsvInfo?.term.guest_type}
                secondary="term.guest_type"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                {...{
                  // docs の反映がまだ
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  primary: rsvInfo?.term.class,
                  secondary: "term.class",
                }}
              />
            </ListItem>
          </List>
          <code style={{ wordBreak: "break-all" }}>{json}</code>
        </CardList>
      </Grid>
    </Grid>
  );
};

export default RsvQRTester;
