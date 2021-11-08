import React, { useMemo } from "react";
import api, { ActivityLog, AllStatus, Guest } from "@afes-website/docs";
import clsx from "clsx";
import moment from "moment";
import { Avatar, ListItemText, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@material-ui/lab";
import { Login, Logout } from "components/MaterialSvgIcons";
import { useAspidaClient } from "hooks/auth/useAuth";
import { getStringTime } from "libs/stringDate";

const useStyles = makeStyles(() =>
  createStyles({
    dot: {
      height: 40,
      width: 40,
      boxSizing: "border-box",
      padding: 6,
    },
    avatar: {
      padding: 0,
      border: "none",
      background: "transparent",
    },
    time: {
      height: 44,
      flexBasis: 40,
      flexGrow: "unset",
      flexShrink: "unset",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    alignCenter: {
      height: 48,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
    },
    text: {
      margin: 0,
    },
    lastConnector: {
      backgroundImage: "linear-gradient(0deg, #bdbdbd 50%, transparent 50%)",
      backgroundSize: "4px 4px",
      backgroundColor: "unset",
      height: 28,
    },
  })
);

interface ExhLog {
  exhId: string;
  enterTimestamp: string | null;
  exitTimestamp: string | null;
}

interface RegRevLog {
  log_type: "check-in" | "check-out" | "register-spare" | "force-revoke";
  timestamp: string;
}

type Log = ExhLog | RegRevLog;

const ActivityLogTimeline: React.VFC<{
  guestInfo: Guest;
  logs: ActivityLog[];
  exhStatus: AllStatus;
}> = ({ guestInfo, logs: activityLogs, exhStatus }) => {
  const classes = useStyles();

  const logs = useMemo(() => convertToLogs(activityLogs), [activityLogs]);

  if (!exhStatus) return null;

  return (
    <Timeline>
      {logs.map((log, index) =>
        "exhId" in log ? (
          // 展示入退室
          <ExhLogListItem
            log={log}
            exhStatus={exhStatus}
            guestInfo={guestInfo}
            index={index}
            logLength={logs.length}
          />
        ) : (
          // 入退場・スペア登録・強制退場
          <RegRevLogListItem
            log={log}
            guestInfo={guestInfo}
            index={index}
            logLength={logs.length}
          />
        )
      )}
      {!guestInfo.revoked_at && (
        // グレーアウトされた「文化祭 退場」
        <TimelineItem>
          <TimelineOppositeContent
            className={clsx(classes.time, classes.alignCenter)}
          >
            <Typography variant="body2" color="textSecondary">
              {guestInfo.revoked_at && getStringTime(guestInfo.revoked_at)}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot
              className={classes.dot}
              color={guestInfo.revoked_at ? "primary" : "grey"}
            >
              <Login />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent>
            <ListItemText
              primary="文化祭 退場"
              secondary={`退場予定時刻: ${getStringTime(
                guestInfo.term.exit_scheduled_time
              )}`}
              className={classes.text}
            />
          </TimelineContent>
        </TimelineItem>
      )}
    </Timeline>
  );
};

export default ActivityLogTimeline;

const ExhLogListItem: React.VFC<{
  log: ExhLog;
  exhStatus: AllStatus;
  guestInfo: Guest;
  index: number;
  logLength: number;
}> = ({ log, exhStatus, guestInfo, index, logLength }) => {
  const classes = useStyles();
  const aspida = useAspidaClient();

  return (
    <TimelineItem>
      <TimelineOppositeContent className={classes.time}>
        <Typography variant="body2" color="textSecondary">
          {log.enterTimestamp && getStringTime(log.enterTimestamp)}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {log.exitTimestamp && getStringTime(log.exitTimestamp)}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot className={classes.avatar}>
          <Avatar
            alt={
              log.exhId in exhStatus.exhibition
                ? exhStatus.exhibition[log.exhId].info.name
                : "?"
            }
            src={api(aspida)
              .images._id(
                log.exhId in exhStatus.exhibition
                  ? exhStatus.exhibition[log.exhId].info.thumbnail_image_id
                  : ""
              )
              .$path({ query: { size: "s" } })}
          />
        </TimelineDot>
        <TimelineConnector
          className={clsx({
            [classes.lastConnector]:
              index === logLength - 1 && !guestInfo.revoked_at,
          })}
        />
      </TimelineSeparator>
      <TimelineContent>
        <ListItemText
          primary={
            log.exhId in exhStatus.exhibition
              ? exhStatus.exhibition[log.exhId].info.name
              : "不明な展示"
          }
          secondary={`${
            log.exhId in exhStatus.exhibition
              ? exhStatus.exhibition[log.exhId].info.room_id
              : "-"
          }・@${log.exhId}`}
          className={classes.text}
        />
      </TimelineContent>
    </TimelineItem>
  );
};

const RegRevLogListItem: React.VFC<{
  log: RegRevLog;
  guestInfo: Guest;
  index: number;
  logLength: number;
}> = ({ log, guestInfo, index, logLength }) => {
  const classes = useStyles();

  const primaryText = useMemo(() => {
    switch (log.log_type) {
      case "check-in":
        return "文化祭 入場";
      case "register-spare":
        return "予備リストバンド 登録";
      case "check-out":
        return "文化祭 退場";
      case "force-revoke":
        return "強制退場";
    }
  }, [log.log_type]);

  const secondaryText = useMemo(() => {
    switch (log.log_type) {
      case "check-in":
      case "register-spare":
        return `入場予定時刻: ${getStringTime(
          guestInfo.term.enter_scheduled_time
        )}`;
      case "check-out":
      case "force-revoke":
        return `退場予定時刻: ${getStringTime(
          guestInfo.term.exit_scheduled_time
        )}`;
    }
  }, [
    guestInfo.term.enter_scheduled_time,
    guestInfo.term.exit_scheduled_time,
    log.log_type,
  ]);

  return (
    <TimelineItem>
      <TimelineOppositeContent
        className={clsx(classes.time, classes.alignCenter)}
      >
        <Typography variant="body2" color="textSecondary">
          {guestInfo.registered_at
            ? getStringTime(guestInfo.registered_at)
            : "-"}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot className={classes.dot} color="primary">
          {log.log_type === "check-in" || log.log_type === "register-spare" ? (
            <Login />
          ) : (
            <Logout />
          )}
        </TimelineDot>
        {(log.log_type === "check-in" || log.log_type === "register-spare") && (
          <TimelineConnector
            className={clsx({
              [classes.lastConnector]:
                index === logLength - 1 && !guestInfo.revoked_at,
            })}
          />
        )}
      </TimelineSeparator>
      <TimelineContent className={classes.alignCenter}>
        <ListItemText
          primary={primaryText}
          secondary={secondaryText}
          className={classes.text}
        />
      </TimelineContent>
    </TimelineItem>
  );
};

const convertToLogs = (activityLogs: ActivityLog[]): Log[] => {
  const logs: Log[] = [];

  activityLogs
    .sort((a, b) => moment(a.timestamp).diff(b.timestamp))
    .forEach((aLog) => {
      if (aLog.log_type === "enter" || aLog.log_type === "exit") {
        if (logs.length > 0) {
          const previousLog = logs[logs.length - 1];
          if (
            "exhId" in previousLog &&
            previousLog.exhId === aLog.exhibition_id &&
            !previousLog.exitTimestamp
          ) {
            // 前回の展示に退出
            logs.pop();
            logs.push({
              ...previousLog,
              exitTimestamp: aLog.timestamp,
            });
            return;
          }
        }
        if (aLog.log_type === "enter")
          logs.push({
            exhId: aLog.exhibition_id,
            enterTimestamp: aLog.timestamp,
            exitTimestamp: null,
          });
        else
          logs.push({
            exhId: aLog.exhibition_id,
            enterTimestamp: null,
            exitTimestamp: aLog.timestamp,
          });
      } else {
        logs.push({
          log_type: aLog.log_type,
          timestamp: aLog.timestamp,
        });
        return;
      }
    });

  return logs;
};
