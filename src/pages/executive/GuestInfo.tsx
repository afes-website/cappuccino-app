import React, { useCallback, useEffect, useRef, useState } from "react";
import api, {
  ActivityLog,
  AllStatus,
  Guest,
  Reservation,
} from "@afes-website/docs";
import clsx from "clsx";
import {
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { AccessTime, Face, People, Person } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import ActivityLogTimeline from "components/ActivityLogTimeline";
import CardList from "components/CardList";
import DirectInputFab from "components/DirectInputFab";
import DirectInputModal from "components/DirectInputModal";
import ErrorAlert from "components/ErrorAlert";
import { ReservationTicket } from "components/MaterialSvgIcons";
import QRScanner from "components/QRScanner";
import ResultChip, { ResultChipRefs } from "components/ResultChip";
import { useAspidaClient, useAuthState } from "hooks/auth/useAuth";
import { useRequirePermission } from "hooks/auth/useRequirePermission";
import useCheckRsv from "hooks/useCheckRsv";
import useErrorHandler from "hooks/useErrorHandler";
import useHandleRsvInput from "hooks/useHandleRsvInput";
import useReset from "hooks/useReset";
import useWristBandPaletteColor from "hooks/useWristBandColor";
import { getStringDateTimeBrief } from "libs/stringDate";
import { useTitleSet } from "libs/title";
import { StatusColor } from "types/statusColor";

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

const GuestInfo: React.VFC = () => {
  useTitleSet("予約・来場者情報照会");
  useRequirePermission(["executive", "reservation"]);

  const classes = useStyles();
  const aspida = useAspidaClient();
  const { currentUser } = useAuthState();
  const resultChipRef = useRef<ResultChipRefs>(null);

  const wristBandPaletteColor = useWristBandPaletteColor();

  const [mode, setMode] = useState<"rsv" | "guest">(
    currentUser?.permissions.reservation ? "rsv" : "guest"
  );

  // guest
  const [guestId, setGuestId] = useState<string>("");
  const [guestInfo, setGuestInfo] = useState<Guest | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[] | null>(null);
  const [exhStatus, setExhStatus] = useState<AllStatus | null>(null);

  // 直接入力モーダルの開閉状態
  const [directInputModalOpen, setDirectInputModalOpen] = useState(false);

  const [status, setStatus] = useState<StatusColor | null>(null);

  // エラー処理
  const [errorMessage, setError, setErrorCode] = useErrorHandler();

  const [resetKey, reset] = useReset();

  const {
    latestRsvId: rsvId,
    handleRsvScan,
    handleRsvIdDirectInput,
    init: initHandleRsvScan,
  } = useHandleRsvInput(setErrorCode, setStatus);

  const {
    latestRsv: rsvInfo,
    checkRsv,
    init: initCheckRsv,
  } = useCheckRsv(setError, setErrorCode, setStatus);

  const clearInfo = useCallback(() => {
    // rsv
    initHandleRsvScan();
    initCheckRsv();
    // guest
    setGuestInfo(null);
    setActivityLogs(null);
    setExhStatus(null);
  }, [initCheckRsv, initHandleRsvScan]);

  // モード切り替え時の初期化
  useEffect(() => {
    setGuestId("");
    clearInfo();
    reset();

    // error
    setStatus(null);
    setError(null);
    if (resultChipRef.current) resultChipRef.current.close();
  }, [clearInfo, mode, reset, setError]);

  const handleScan = (value: string) => {
    clearInfo();
    switch (mode) {
      case "rsv":
        handleRsvScan(value, (rsvId) => {
          checkRsv(rsvId);
        });
        break;
      case "guest":
        handleGuestIdScan(value);
        break;
    }
  };

  const handleDirectInput = (id: string) => {
    clearInfo();
    switch (mode) {
      case "rsv":
        handleRsvIdDirectInput(id, (rsvId) => {
          checkRsv(rsvId);
        });
        break;
      case "guest":
        handleGuestIdScan(id);
        break;
    }
  };

  const handleGuestIdScan = async (_guestId: string) => {
    setGuestId(_guestId);
    setStatus("loading");
    try {
      const getGuestInfo = api(aspida)
        .guests._id(_guestId)
        .$get({
          headers: {
            Authorization: "bearer " + currentUser?.token,
          },
        })
        .then((_info) => {
          setGuestInfo(_info);
        });
      const getActivityLog = api(aspida)
        .log.$get({
          headers: {
            Authorization: "bearer " + currentUser?.token,
          },
          query: { guest_id: _guestId },
        })
        .then((_logs) => {
          setActivityLogs(_logs);
        });
      const getExhStatus = api(aspida)
        .exhibitions.$get()
        .then((_status) => {
          setExhStatus(_status);
        });
      await Promise.all([getGuestInfo, getActivityLog, getExhStatus]);
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError(e);
    }
  };

  useEffect(() => {
    const name = { rsv: "予約", guest: "ゲスト" };
    const id = { rsv: rsvId, guest: guestId };
    switch (status) {
      case "loading":
        setError(null);
        if (resultChipRef.current) resultChipRef.current.close();
        break;
      case "success":
        if (resultChipRef.current && id[mode])
          resultChipRef.current.open(
            "success",
            `取得成功 / ${name[mode]} ID: ${id[mode]}`,
            3000
          );
        break;
      case "error":
        if (resultChipRef.current && id[mode])
          resultChipRef.current.open(
            "error",
            `取得失敗 / ${name[mode]} ID: ${id[mode]}`
          );
        break;
    }
  }, [mode, status, guestId, rsvId, setError, clearInfo]);

  return (
    <>
      <Paper square className={classes.tabs}>
        <Tabs
          value={mode}
          onChange={(e, newValue: "rsv" | "guest") => {
            setMode(newValue);
          }}
          variant="fullWidth"
          color="secondary"
        >
          <Tab
            label="予約 登録情報一覧"
            value="rsv"
            disabled={!currentUser?.permissions.reservation}
          />
          <Tab
            label="来場者 行動履歴一覧"
            value="guest"
            disabled={!currentUser?.permissions.executive}
          />
        </Tabs>
      </Paper>
      <Grid container className={classes.list}>
        <Grid xs={12} md={6}>
          <CardList>
            <Card className={classes.resultChipBase}>
              <QRScanner
                onScanFunc={handleScan}
                videoStop={false}
                color={status || undefined}
                resetKey={resetKey}
              />
              {status && (
                <ResultChip
                  ref={resultChipRef}
                  className={classes.resultChip}
                />
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
            {mode === "rsv" && (
              <>
                {status === "success" && rsvInfo && (
                  <Card>
                    <Alert severity="success">{`あと ${
                      rsvInfo.member_all - rsvInfo.member_checked_in
                    } 人入場可能`}</Alert>
                  </Card>
                )}
                <Card>
                  <CardContent
                    className={clsx({
                      [classes.cardTitle]: rsvId,
                    })}
                  >
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom={true}
                    >
                      予約情報
                    </Typography>
                    {!rsvId && (
                      <Typography variant="caption" align="center">
                        まだ予約QRコードをスキャンしていません。
                      </Typography>
                    )}
                  </CardContent>
                  {rsvId && <PrivateInfoList rsvId={rsvId} info={rsvInfo} />}
                </Card>
              </>
            )}
            {mode === "guest" && (
              <>
                <Card>
                  <CardContent
                    className={clsx({
                      [classes.cardTitle]: guestId,
                    })}
                  >
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom={true}
                    >
                      ゲスト情報
                    </Typography>
                    {!guestId && (
                      <Typography variant="caption" align="center">
                        まだゲストQRコードをスキャンしていません。
                      </Typography>
                    )}
                  </CardContent>
                  {guestId && (
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Face />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <>
                              {guestInfo && (
                                <span
                                  className={classes.termColorBadge}
                                  style={{
                                    background: wristBandPaletteColor(
                                      guestInfo.term.guest_type
                                    ).main,
                                  }}
                                />
                              )}
                              {guestId}
                            </>
                          }
                          secondary="ゲスト ID"
                        />
                      </ListItem>
                    </List>
                  )}
                </Card>
                <Card>
                  <CardContent
                    className={clsx({
                      [classes.cardTitle]: activityLogs && exhStatus,
                    })}
                  >
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom={true}
                    >
                      行動履歴一覧
                    </Typography>
                    {!guestId ? (
                      <Typography variant="caption" align="center">
                        まだゲストQRコードをスキャンしていません。
                      </Typography>
                    ) : (
                      !activityLogs && (
                        <Typography variant="caption" align="center">
                          まだゲストQRコードをスキャンしていません。
                        </Typography>
                      )
                    )}
                    {activityLogs?.length === 0 && (
                      <Typography variant="caption" align="center">
                        展示への入退出記録がありません。
                      </Typography>
                    )}
                  </CardContent>
                  {guestInfo &&
                    activityLogs &&
                    exhStatus &&
                    activityLogs.length > 0 && (
                      <ActivityLogTimeline
                        guestInfo={guestInfo}
                        logs={activityLogs}
                        exhStatus={exhStatus}
                      />
                    )}
                </Card>
              </>
            )}
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              gutterBottom={true}
            >
              情報の取り扱いには十分注意してください。
            </Typography>
          </CardList>
        </Grid>
      </Grid>

      {/* 直接入力ボタン */}
      <DirectInputFab
        onClick={() => {
          setDirectInputModalOpen(true);
        }}
        disabled={status === "loading"}
      />

      {/* 直接入力モーダル */}
      <DirectInputModal
        open={directInputModalOpen}
        setOpen={setDirectInputModalOpen}
        onIdChange={handleDirectInput}
        currentId={{ rsv: rsvId, guest: guestId }[mode]}
        type={mode}
      />
    </>
  );
};

export default GuestInfo;

const useComponentsStyles = makeStyles((theme) =>
  createStyles({
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

const PrivateInfoList: React.VFC<{
  rsvId: string;
  info: Reservation | null;
}> = ({ rsvId, info }) => {
  const classes = useComponentsStyles();
  const wristBandPaletteColor = useWristBandPaletteColor();

  return (
    <List>
      <ListItem>
        <ListItemIcon>
          <ReservationTicket />
        </ListItemIcon>
        <ListItemText primary={rsvId} secondary="予約 ID" />
      </ListItem>
      {info && (
        <>
          <ListItem>
            <ListItemIcon>
              <AccessTime />
            </ListItemIcon>
            <ListItemText
              primary={
                <>
                  <span
                    className={classes.termColorBadge}
                    style={{
                      background: wristBandPaletteColor(info.term.guest_type)
                        .main,
                    }}
                  />
                  {`${getStringDateTimeBrief(
                    info.term.enter_scheduled_time
                  )} - ${getStringDateTimeBrief(
                    info.term.exit_scheduled_time
                  )}`}
                </>
              }
              secondary="予約時間帯"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              {info.member_all === 1 ? <Person /> : <People />}
            </ListItemIcon>
            <ListItemText
              primary={
                info.member_all === 1
                  ? "一般枠（中学生以上 1 名）"
                  : "児童枠（小学生とその保護者 計 2 名）"
              }
              secondary="予約枠"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Face />
            </ListItemIcon>
            <ListItemText
              primary={`${info.member_checked_in} 人（あと ${
                info.member_all - info.member_checked_in
              } 人入場可能）`}
              secondary="入場済み人数"
            />
          </ListItem>
        </>
      )}
    </List>
  );
};
