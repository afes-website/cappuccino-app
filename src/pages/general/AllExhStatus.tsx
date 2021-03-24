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
  ButtonGroup,
  Button,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import PullToRefresh from "@/components/PullToRefresh";
import { useWristBandPaletteColor } from "@/libs/wristBandColor";
import { AuthContext, useVerifyPermission } from "@/libs/auth";
import { useTitleSet } from "@/libs/title";
import api, { AllStatus, ExhStatus, Terms } from "@afes-website/docs";
import aspida from "@aspida/axios";

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
    sortKeySelector: {
      margin: `0 ${theme.spacing(1)}px`,
      width: `calc(100% - ${theme.spacing(2)}px)`,
    },
    sortMessage: {
      marginTop: theme.spacing(1.5),
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
      borderRadius: "4px 4px 0 0",
    },
    countLimit: {
      marginLeft: 4,
    },
  })
);

const sortKeys = ["roomId", "count", "congestion"] as const;
type SortKey = typeof sortKeys[number];

const AllExhStatus: React.FC = () => {
  useTitleSet("全展示の滞在状況一覧");
  useVerifyPermission("general");

  const classes = useStyles();
  const auth = useContext(AuthContext).val;

  const [status, setStatus] = useState<AllStatus | null>(null);
  const [terms, setTerms] = useState<Terms | null>(null);

  const [sortKey, setSortKey] = useState<SortKey>("roomId");

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

  const onSortKeyChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const val: string = e.currentTarget.value;
    if ((sortKeys as ReadonlyArray<string>).includes(val))
      setSortKey(val as SortKey);
  };

  return (
    <PullToRefresh onRefresh={fetch}>
      <div className={classes.root}>
        <ButtonGroup fullWidth className={classes.sortKeySelector}>
          {Object.entries(sortOptions).map(([key, { label }]) => (
            <Button
              key={key}
              value={key}
              color={key === sortKey ? "primary" : "secondary"}
              variant={key === sortKey ? "contained" : "outlined"}
              onClick={onSortKeyChange}
              fullWidth
            >
              {label}順
            </Button>
          ))}
        </ButtonGroup>
        <Typography
          align="center"
          variant="body2"
          color="textSecondary"
          className={classes.sortMessage}
        >
          {sortOptions[sortKey].message}
        </Typography>
        <List>
          {Object.entries(status.exh)
            .sort(sortOptions[sortKey].compareFn)
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

const sortOptions: {
  [key in SortKey]: {
    label: string;
    message: string;
    compareFn: (a: [string, ExhStatus], b: [string, ExhStatus]) => number;
  };
} = {
  roomId: {
    label: "展示番号",
    message: "展示番号順に、すべての展示を表示しています。",
    compareFn: ([, a], [, b]) => {
      if (a.info.room_id < b.info.room_id) return -1;
      if (a.info.room_id > b.info.room_id) return 1;
      return 0;
    },
  },
  count: {
    label: "滞在人数",
    message: "滞在人数が多い順に、すべての展示を表示しています。",
    compareFn: ([, a], [, b]) => {
      const sum_a = Object.values(a.count).reduce(
        (prev, curr) => prev + curr,
        0
      );
      const sum_b = Object.values(b.count).reduce(
        (prev, curr) => prev + curr,
        0
      );
      return (sum_a - sum_b) * -1;
    },
  },
  congestion: {
    label: "混雑度",
    message: "空き枠が少ない順に、すべての展示を表示しています。",
    compareFn: ([, a], [, b]) => {
      const sum_a = Object.values(a.count).reduce(
        (prev, curr) => prev + curr,
        0
      );
      const sum_b = Object.values(b.count).reduce(
        (prev, curr) => prev + curr,
        0
      );
      // ソート順序: (上限人数 - 滞在人数) 等しい場合は人数が多いほうが混雑
      return a.limit - sum_a - (b.limit - sum_b) || sum_b - sum_a;
    },
  },
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
      theme.palette.action.disabledBackground,
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
