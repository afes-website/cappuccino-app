import React from "react";
import { Reservation } from "@afes-website/docs";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { wristBandPaletteColor } from "hooks/useWristBandColor";
import { getStringDateJp, getStringTimeJp } from "libs/stringDateJp";
import { ReactComponent as Child } from "assets/child.svg";
import { ReactComponent as LogoWhite } from "assets/logo.svg";
import { ReactComponent as Person } from "assets/person.svg";

const useStyles = makeStyles({
  ticketHeader: {
    padding: "64px 24px 24px 24px",
    color: "#fff",
    fontWeight: 700,
    fontSize: 20,
    position: "relative",
    transition: "background 1s",
  },
  ticketLogo: {
    position: "absolute",
    top: 16,
    left: 16,
    height: 36,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "& > svg": {
      height: 30,
      fill: "#fff",
    },
    "& > span": {
      fontSize: 16,
      paddingLeft: 8,
    },
  },
  ticketHeaderContent: {
    display: "flex",
    flexDirection: "column",
    "& > * + *": {
      marginTop: 8,
    },
    "& > *": {
      height: 29,
    },
  },
  ticketMemberAll: {
    position: "absolute",
    right: 12,
    bottom: 20,
    opacity: 0.8,
    fill: "#fff",
    width: 70,
    height: 70,
  },
  cutLine: {
    position: "relative",
    "&::after": {
      background:
        "radial-gradient(circle farthest-side, #d5d5d5, #d5d5d5 60%, transparent 60%, transparent);",
      backgroundSize: "12px 12px",
      backgroundPosition: "center",
      content: "''",
      display: "inline-block",
      position: "absolute",
      width: "100%",
      height: 12,
      left: 0,
      bottom: -6,
    },
  },
});

interface Props {
  rsv: Reservation | null;
}

const TicketHeader: React.VFC<Props> = ({ rsv }) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.ticketHeader, classes.cutLine)}
      style={{
        background: rsv
          ? wristBandPaletteColor(rsv.term.guest_type, "light").dark
          : "none",
      }}
    >
      <div className={classes.ticketLogo}>
        <LogoWhite />
        <span>
          {rsv && rsv.member_all <= 2 ? "デジタルチケット" : "文化祭入場券"}
          {rsv &&
            ({ 1: "（一般枠）", 2: "（児童枠）" }[rsv.member_all] ??
              "（保護者枠）")}
        </span>
      </div>
      <span className={classes.ticketMemberAll}>
        {rsv && (rsv.member_all === 2 ? <Child /> : <Person />)}
      </span>
      <div className={classes.ticketHeaderContent}>
        <span>
          {rsv ? (
            getStringDateJp(rsv.term.enter_scheduled_time)
          ) : (
            <Skeleton width={180} height={36} />
          )}
        </span>
        <span>
          {rsv ? (
            `${getStringTimeJp(
              rsv.term.enter_scheduled_time
            )} ～ ${getStringTimeJp(rsv.term.exit_scheduled_time)}`
          ) : (
            <Skeleton width={180} height={36} />
          )}
        </span>
      </div>
    </div>
  );
};

export default TicketHeader;
