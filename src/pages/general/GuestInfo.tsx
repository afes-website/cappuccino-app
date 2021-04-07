import React, { useContext, useRef, useState } from "react";
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
import { AuthContext, useVerifyPermission } from "libs/auth";
import { useTitleSet } from "libs/title";
import CardList from "components/CardList";
import QRScanner from "components/QRScanner";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ResultChip, { ResultChipRefs } from "components/ResultChip";
import api, {
  ActivityLog,
  AllStatus,
  Guest,
  ReservationWithPrivateInfo,
} from "@afes-website/docs";
import aspida from "@aspida/axios";
import { Login, Logout, WristBand } from "components/MaterialSvgIcons";
import { AccessTime } from "@material-ui/icons";
import { getStringDateTime, getStringDateTimeBrief } from "libs/stringDate";
import clsx from "clsx";
import DirectInputFab from "components/DirectInputFab";
import DirectInputModal from "components/DirectInputModal";
import { StatusColor } from "types/statusColor";
import { useWristBandPaletteColor } from "libs/wristBandColor";
import moment from "moment";

const useStyles = makeStyles((theme) =>
  createStyles({
    tabs: {
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
    termColorBadge: {
      display: "inline-block",
      width: 14,
      height: 14,
      borderRadius: 7,
      marginBottom: -1,
      marginRight: theme.spacing(0.75),
    },
  })
);

const GuestInfo: React.FC = () => {
  useTitleSet("来場者・予約情報照会");
  useVerifyPermission(["general", "reservation"]);

  const classes = useStyles();
  const auth = useContext(AuthContext).val;
  const resultChipRef = useRef<ResultChipRefs>(null);
  const wristBandPaletteColor = useWristBandPaletteColor();

  const [mode, setMode] = useState<"guest" | "rsv">(
    auth.get_current_user()?.permissions.general ? "guest" : "rsv"
  );

  // guest
  const [guestId, setGuestId] = useState<string>("");
  const [guestInfo, setGuestInfo] = useState<Guest | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[] | null>(null);
  const [exhStatus, setExhStatus] = useState<AllStatus | null>(null);

  // reservation
  const [rsvId, setRsvId] = useState<string>("");
  const [rsvInfo, setRsvInfo] = useState<ReservationWithPrivateInfo | null>(
    null
  );

  // 直接入力モーダルの開閉状態
  const [opensGuestInputModal, setOpensGuestInputModal] = useState(false);
  const [opensRsvInputModal, setOpensRsvInputModal] = useState(false);

  // 予約ID・ゲストIDそれぞれのチェック結果
  const [rsvCheckStatus, setRsvCheckStatus] = useState<StatusColor | null>(
    null
  );
  const [guestCheckStatus, setGuestCheckStatus] = useState<StatusColor | null>(
    null
  );

  const handleScan = (value: string | null) => {
    if (value) {
      switch (mode) {
        case "guest":
          handleGuestIdScan(value);
      }
    }
  };

  const handleGuestIdScan = (_guestId: string) => {
    api(aspida())
      .onsite.general.guest._id(_guestId)
      .$get({
        headers: { Authorization: "bearer " + auth.get_current_user()?.token },
      })
      .then((_info) => {
        setGuestInfo(_info);
      });
    api(aspida())
      .onsite.general.log.$get({
        headers: {
          Authorization: "bearer " + auth.get_current_user()?.token,
        },
        query: { guest_id: _guestId },
      })
      .then((_logs) => {
        setActivityLogs(_logs);
      });
    api(aspida())
      .onsite.exhibition.status.$get({
        headers: {
          Authorization: "bearer " + auth.get_current_user()?.token,
        },
      })
      .then((_status) => {
        setExhStatus(_status);
      });
  };

  const handleRsvIdScan = (_rsvId: string) => {
    api(aspida())
      .onsite.reservation._id(_rsvId)
      .$get({
        headers: {
          Authorization: "bearer " + auth.get_current_user()?.token,
        },
      })
      .then((_rsvInfo) => {
        setRsvInfo(_rsvInfo);
      });
  };

  return (
    <>
      <Paper square className={classes.tabs}>
        <Tabs
          value={mode}
          onChange={(e, newValue: "guest" | "rsv") => {
            setMode(newValue);
          }}
          variant="fullWidth"
          color="secondary"
        >
          <Tab
            label="来場者 行動履歴一覧"
            value="guest"
            disabled={!auth.get_current_user()?.permissions.general}
          />

          <Tab
            label="予約 登録情報"
            value="rsv"
            disabled={!auth.get_current_user()?.permissions.reservation}
          />
        </Tabs>
      </Paper>
      <CardList className={classes.list}>
        <Card className={classes.resultChipBase}>
          <QRScanner onScanFunc={handleScan} videoStop={false} />
          <ResultChip ref={resultChipRef} className={classes.resultChip} />
        </Card>

        {mode === "guest" && (
          <>
            <Card>
              <CardContent
                className={clsx({
                  [classes.cardTitle]: guestInfo,
                })}
              >
                <Typography
                  style={{ fontSize: 14 }}
                  color="textSecondary"
                  gutterBottom={true}
                >
                  ゲスト情報
                </Typography>
                {!guestInfo && (
                  <Typography variant="caption" align="center">
                    まだゲストQRコードをスキャンしていません。
                  </Typography>
                )}
              </CardContent>
              {guestInfo && <GuestInfoList guest={guestInfo} />}
            </Card>
            <Card>
              <CardContent
                className={clsx({
                  [classes.cardTitle]: activityLogs && exhStatus,
                })}
              >
                <Typography
                  style={{ fontSize: 14 }}
                  color="textSecondary"
                  gutterBottom={true}
                >
                  行動履歴一覧
                </Typography>
                {!activityLogs && (
                  <Typography variant="caption" align="center">
                    まだゲストQRコードをスキャンしていません。
                  </Typography>
                )}
                {activityLogs?.length === 0 && (
                  <Typography variant="caption" align="center">
                    展示への入退出記録がありません。
                  </Typography>
                )}
              </CardContent>
              {activityLogs && exhStatus && activityLogs.length > 0 && (
                <LogList logs={activityLogs} status={exhStatus} />
              )}
            </Card>
          </>
        )}
      </CardList>

      {/* 直接入力ボタン */}
      <DirectInputFab
        onClick={() => {
          ({ guest: setOpensGuestInputModal, rsv: setOpensRsvInputModal }[mode](
            true
          ));
        }}
        disabled={
          { guest: guestCheckStatus, rsv: rsvCheckStatus }[mode] === "loading"
        }
      />

      {/* 直接入力モーダル */}
      <DirectInputModal
        open={opensGuestInputModal}
        setOpen={setOpensGuestInputModal}
        onIdChange={handleGuestIdScan}
        currentId={guestId}
        type="guest"
      />
      <DirectInputModal
        open={opensRsvInputModal}
        setOpen={setOpensRsvInputModal}
        onIdChange={handleRsvIdScan}
        currentId={rsvId}
        type="rsv"
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

const GuestInfoList: React.FC<{ guest: Guest }> = ({ guest }) => {
  const classes = useComponentsStyles();
  const wristBandPaletteColor = useWristBandPaletteColor();

  return (
    <List>
      <ListItem>
        <ListItemIcon>
          <WristBand />
        </ListItemIcon>
        <ListItemText
          primary={
            <>
              <span
                className={classes.termColorBadge}
                style={{
                  background: wristBandPaletteColor(guest.term.guest_type).main,
                }}
              />
              {guest.id}
            </>
          }
          secondary="ゲスト ID"
        />
      </ListItem>
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <ListItem>
            <ListItemIcon>
              <Login />
            </ListItemIcon>
            <ListItemText
              primary={getStringDateTimeBrief(guest.entered_at)}
              secondary="入場時刻"
            />
          </ListItem>
        </Grid>
        <Grid item xs={6}>
          <ListItem>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText
              primary={
                guest.exited_at ? getStringDateTimeBrief(guest.exited_at) : "-"
              }
              secondary="退場時刻"
            />
          </ListItem>
        </Grid>
      </Grid>
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <ListItem>
            <ListItemIcon>
              <AccessTime />
            </ListItemIcon>
            <ListItemText
              primary={
                guest.term.enter_scheduled_time
                  ? getStringDateTimeBrief(guest.term.enter_scheduled_time)
                  : "-"
              }
              secondary="入場予定時刻"
            />
          </ListItem>
        </Grid>
        <Grid item xs={6}>
          <ListItem>
            <ListItemIcon>
              <AccessTime />
            </ListItemIcon>
            <ListItemText
              primary={
                guest.term.exit_scheduled_time
                  ? getStringDateTimeBrief(guest.term.exit_scheduled_time)
                  : "-"
              }
              secondary="退場予定時刻"
            />
          </ListItem>
        </Grid>
      </Grid>
    </List>
  );
};

const LogList: React.FC<{ logs: ActivityLog[]; status: AllStatus }> = ({
  logs,
  status,
}) => (
  <List>
    {logs
      .sort((a, b) => {
        const timeA = moment(a.timestamp);
        const timeB = moment(b.timestamp);
        if (timeA.isSame(timeB)) return 0;
        if (timeA.isBefore(timeB)) return -1;
        return 1;
      })
      .map((log) => (
        <ListItem key={log.id}>
          <ListItemIcon>
            {log.log_type === "enter" ? <Login /> : <Logout />}
          </ListItemIcon>
          <ListItemText
            primary={`${status.exh[log.exh_id]?.info.name || "-"} ${
              log.log_type === "enter" ? "入室" : "退室"
            }`}
            secondary={getStringDateTime(log.timestamp)}
          />
        </ListItem>
      ))}
  </List>
);
