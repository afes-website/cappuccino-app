import React, { useMemo } from "react";
import { Avatar, ListItemText, Typography } from "@material-ui/core";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@material-ui/lab";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Login } from "components/MaterialSvgIcons";
import { getStringTime } from "libs/stringDate";
import api, { ActivityLog, AllStatus, Guest } from "@afes-website/docs";
import aspida from "@aspida/axios";
import moment from "moment";
import clsx from "clsx";

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

const ActivityLogTimeline: React.VFC<{
  guestInfo: Guest;
  logs: ActivityLog[];
  exhStatus: AllStatus;
}> = ({ guestInfo, logs: activityLogs, exhStatus }) => {
  const classes = useStyles();

  const exhLogs = useMemo(() => convertToExhLog(activityLogs), [activityLogs]);

  if (!exhStatus) return null;

  return (
    <Timeline>
      <TimelineItem>
        <TimelineOppositeContent
          className={clsx(classes.time, classes.alignCenter)}
        >
          <Typography variant="body2" color="textSecondary">
            {getStringTime(guestInfo.entered_at)}
          </Typography>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot className={classes.dot} color="primary">
            <Login />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent className={classes.alignCenter}>
          <ListItemText
            primary="文化祭 入場"
            secondary={`入場予定時刻: ${getStringTime(
              guestInfo.term.enter_scheduled_time
            )}`}
            className={classes.text}
          />
        </TimelineContent>
      </TimelineItem>
      {exhLogs.map((log, index) => (
        <TimelineItem key={index}>
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
                src={api(aspida())
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
                  index === exhLogs.length - 1 && !guestInfo.exited_at,
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
      ))}
      <TimelineItem>
        <TimelineOppositeContent
          className={clsx(classes.time, classes.alignCenter)}
        >
          <Typography variant="body2" color="textSecondary">
            {guestInfo.exited_at && getStringTime(guestInfo.exited_at)}
          </Typography>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot
            className={classes.dot}
            color={guestInfo.exited_at ? "primary" : "grey"}
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
    </Timeline>
  );
};

export default ActivityLogTimeline;

const convertToExhLog = (activityLogs: ActivityLog[]): ExhLog[] => {
  const exhLogs: ExhLog[] = [];

  activityLogs
    .sort((a, b) => moment(a.timestamp).diff(b.timestamp))
    .forEach((aLog) => {
      if (
        exhLogs.length > 0 &&
        exhLogs[exhLogs.length - 1].exhId == aLog.exhibition_id &&
        !exhLogs[exhLogs.length - 1].exitTimestamp
      ) {
        // 前回の展示に退出
        exhLogs[exhLogs.length - 1].exitTimestamp = aLog.timestamp;
        return;
      }
      if (aLog.log_type === "enter")
        exhLogs.push({
          exhId: aLog.exhibition_id,
          enterTimestamp: aLog.timestamp,
          exitTimestamp: null,
        });
      else
        exhLogs.push({
          exhId: aLog.exhibition_id,
          enterTimestamp: null,
          exitTimestamp: aLog.timestamp,
        });
    });

  return exhLogs;
};
