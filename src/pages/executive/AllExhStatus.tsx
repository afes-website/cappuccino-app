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
import PullToRefresh from "components/PullToRefresh";
import { useWristBandPaletteColor } from "libs/wristBandColor";
import { AuthContext, useVerifyPermission } from "libs/auth";
import { useTitleSet } from "libs/title";
import { compareTerm } from "libs/compare";
import api, { AllStatus, ExhibitionStatus, Terms } from "@afes-website/docs";
import aspida from "@aspida/axios";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
    },
    loadingWrapper: {
      height: "calc(var(--100vh, 100vh) - 112px)",
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

const AllExhStatus: React.VFC = () => {
  useTitleSet("全展示の滞在状況一覧");
  useVerifyPermission("executive");

  const classes = useStyles();
  const auth = useContext(AuthContext).val;

  const [status, setStatus] = useState<AllStatus | null>(null);
  const [terms, setTerms] = useState<Terms | null>(null);

  const [sortKey, setSortKey] = useState<SortKey>("roomId");

  const load = useCallback(
    () =>
      Promise.all([
        api(aspida())
          .exhibitions.$get({
            headers: {
              Authorization: "bearer " + auth.get_current_user()?.token,
            },
          })
          .then((res) => {
            setStatus(res);
          }),
        api(aspida())
          .terms.$get({
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
    load();
  }, [auth, load]);

  if (status === null || terms === null)
    return (
      <div className={classes.loadingWrapper}>
        <CircularProgress />
      </div>
    );

  const maxLimit = Object.values(status.exhibition)
    .map((exh) => exh.capacity)
    .reduce((a, b) => Math.max(a, b));

  const onSortKeyChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const val: string = e.currentTarget.value;
    if ((sortKeys as ReadonlyArray<string>).includes(val))
      setSortKey(val as SortKey);
  };

  return (
    <PullToRefresh onRefresh={load}>
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
          {Object.entries(status.exhibition)
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
                    {`/${exhStatus.capacity}人`}
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
    compareFn: (
      a: [string, ExhibitionStatus],
      b: [string, ExhibitionStatus]
    ) => number;
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
      return -(sum_a - sum_b);
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
      return a.capacity - sum_a - (b.capacity - sum_b) ?? sum_b - sum_a;
    },
  },
};

export default AllExhStatus;

const LinearChart: React.VFC<{
  status: ExhibitionStatus;
  terms: Terms;
  maxLimit: number;
  className: string;
}> = ({ status, terms, maxLimit, ...props }) => {
  const count: ExhibitionStatus["count"] = Object.fromEntries(
    Object.entries(status.count).sort(([a], [b]) => compareTerm(a, b, terms))
  );

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
      [`${(sum / maxLimit) * 100}%`, `${(status.capacity / maxLimit) * 100}%`],
    ],
    ["transparent", [`${(status.capacity / maxLimit) * 100}%`, "100%"]],
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
