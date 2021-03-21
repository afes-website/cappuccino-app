import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Avatar,
  CircularProgress,
  List,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItem,
  Typography,
  useTheme,
  Theme,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { AuthContext, useVerifyPermission } from "@/libs/auth";
import { useTitleSet } from "@/libs/title";
import api, { AllStatus, ExhStatus, Terms } from "@afes-website/docs";
import aspida from "@aspida/axios";
import { useWristBandPaletteColor } from "@/libs/wristBandColor";
import PullToRefresh from "@/components/PullToRefresh";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
    },
    loadingWrapper: {
      height: "calc(100vh - 112px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    listItem: {
      position: "relative",
    },
    linearChart: {
      position: "absolute",
      width: `calc(100% - ${theme.spacing(9)}px)`,
      marginLeft: theme.spacing(8),
      marginRight: theme.spacing(2),
      height: 6,
      bottom: 0,
      left: 0,
    },
    countLimit: {
      marginLeft: 4,
    },
  })
);

const AllExhStatus: React.FC = () => {
  useTitleSet("全展示の滞在状況一覧");
  useVerifyPermission("general");

  const classes = useStyles();
  const auth = useContext(AuthContext).val;

  const [status, setStatus] = useState<AllStatus | null>(null);
  const [terms, setTerms] = useState<Terms | null>(null);

  const fetch = useCallback(
    () =>
      Promise.all([
        api(aspida())
          .onsite.exhibition.status.$get({
            headers: {
              Authorization: "bearer " + auth.get_current_user()?.token,
            },
          })
          .then((res) => {
            setStatus(res);
          }),
        api(aspida())
          .onsite.general.term.$get({
            headers: {
              Authorization: "bearer " + auth.get_current_user()?.token,
            },
          })
          .then((terms) => {
            setTerms(terms);
          }),
      ]),
    [auth]
  );

  useEffect(() => {
    fetch();
  }, [auth, fetch]);

  if (status === null || terms === null)
    return (
      <div className={classes.loadingWrapper}>
        <CircularProgress />
      </div>
    );

  const maxLimit = Object.values(status.exh)
    .map((exh) => exh.limit)
    .reduce((a, b) => Math.max(a, b));

  return (
    <PullToRefresh onRefresh={fetch}>
      <div className={classes.root}>
        <Typography align="center" variant="body2" color="textSecondary">
          展示番号順に、すべての展示を表示しています。
        </Typography>
        <List>
          {Object.entries(status.exh)
            .sort(([, a], [, b]) => {
              if (a.info.room_id < b.info.room_id) return -1;
              if (a.info.room_id > b.info.room_id) return 1;
              return 0;
            })
            .map(([exhId, exhStatus]) => (
              <ListItem key={exhId} divider className={classes.listItem}>
                <ListItemIcon>
                  <Avatar
                    alt={exhStatus.info.name}
                    src={api(aspida())
                      .images._id(exhStatus.info.thumbnail_image_id)
                      .$path()}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={exhStatus.info.name}
                  secondary={exhStatus.info.room_id + " • " + `@${exhId}`}
                />
                <ListItemSecondaryAction>
                  <Typography display="inline">
                    {Object.entries(exhStatus.count)
                      .map(([, count]) => count)
                      .reduce((prev, curr) => prev + curr, 0)}
                  </Typography>
                  <Typography
                    display="inline"
                    variant="caption"
                    className={classes.countLimit}
                  >
                    {`/${exhStatus.limit}人`}
                  </Typography>
                </ListItemSecondaryAction>
                <LinearChart
                  className={classes.linearChart}
                  status={exhStatus}
                  terms={terms}
                  maxLimit={maxLimit}
                />
              </ListItem>
            ))}
        </List>
      </div>
    </PullToRefresh>
  );
};

export default AllExhStatus;

const LinearChart: React.FC<{
  status: ExhStatus;
  terms: Terms;
  maxLimit: number;
  className: string;
}> = (props) => {
  const { status, terms, maxLimit } = props;
  const { count } = status;

  const wristBandPaletteColor = useWristBandPaletteColor();
  const theme = useTheme<Theme>();

  const sum = Object.values(count).reduce((prev, curr) => prev + curr, 0);

  const eachSums: number[] = Object.values(count).map((count, index, array) =>
    array.slice(0, index).reduce((prev, curr) => prev + curr, 0)
  );

  const gradientArgs: [string, string[]][] = Object.entries(count).map(
    ([termId, count], index) => {
      const color =
        termId in terms
          ? wristBandPaletteColor(terms[termId].guest_type)[
              theme.palette.type === "light" ? "main" : "dark"
            ]
          : "#ccc";

      return [
        color,
        [
          `${(eachSums[index] / maxLimit) * 100}%`,
          `${((eachSums[index] + count) / maxLimit) * 100}%`,
        ],
      ];
    }
  );

  const gradientString: string = [
    ...gradientArgs,
    [
      theme.palette.type === "light"
        ? "rgba(0, 0, 0, 0.12)"
        : "rgba(255, 255, 255, 0.12)",
      [`${(sum / maxLimit) * 100}%`, `${(status.limit / maxLimit) * 100}%`],
    ],
    ["transparent", [`${(status.limit / maxLimit) * 100}%`, "100%"]],
  ]
    .map((value) => value.flat().join(" "))
    .join(", ");

  return (
    <div
      style={{ background: `linear-gradient( 90deg, ${gradientString})` }}
      className={props.className}
    />
  );
};
