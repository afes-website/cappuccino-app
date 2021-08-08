import React, { useEffect, useState } from "react";
import {
  Card,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
  useTheme,
} from "@material-ui/core";
import { AllStatus } from "@afes-website/docs";
import congestionColor from "libs/congestionColor";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    path: {
      fill: "none",
      stroke: theme.palette.text.primary,
      strokeWidth: 2,
      strokeLinejoin: "round",
    },
  })
);

interface Props {
  exhStatus: AllStatus | null;
}

const CongestionHeatMap: React.VFC<Props> = ({ exhStatus }) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();

  const [exhIds, setExhIds] = useState<{ [roomId: string]: string }>({});

  useEffect(() => {
    setExhIds(
      Object.fromEntries(
        exhStatus
          ? Object.entries(exhStatus.exhibition).map(([exhId, status]) => [
              status.info.room_id,
              exhId,
            ])
          : []
      )
    );
  }, [exhStatus]);

  const fillColor = (roomId: string): string => {
    if (
      exhStatus &&
      Object.prototype.hasOwnProperty.call(exhIds, roomId) &&
      Object.prototype.hasOwnProperty.call(exhStatus.exhibition, exhIds[roomId])
    ) {
      const countSum = Object.values(
        exhStatus.exhibition[exhIds[roomId]].count
      ).reduce((prev, curr) => prev + curr, 0);
      const congestion =
        countSum / exhStatus.exhibition[exhIds[roomId]].capacity;
      return congestionColor(congestion, theme.palette.type).main;
    }
    return theme.palette.action.disabledBackground;
  };

  return (
    <Grid container spacing={2} className={classes.root}>
      {(["1F", "2F", "3F", "4F"] as const).map((elev) => (
        <Grid item xs={12} md={6} key={elev}>
          <Card>
            <svg viewBox="0 0 800 736">
              {Object.entries(rooms[elev]).map(([id, info]) => (
                <rect
                  key={id}
                  x={info.x}
                  y={info.y}
                  width={info.width ?? 64}
                  height={info.height ?? 64}
                  className={classes.path}
                  style={{ fill: fillColor(id) }}
                />
              ))}
              {lines[elev].map((points, index) => (
                <polyline
                  key={index}
                  points={points}
                  className={classes.path}
                />
              ))}
            </svg>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CongestionHeatMap;

const useCongestionExampleStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
    },
    wrapper: {
      display: "flex",
      flexDirection: "row",
    },
    colorList: {
      "& > *": {
        borderRadius: 4,
        width: 24,
        height: 24,
      },
      "& > * + *": {
        marginLeft: 16,
      },
    },
    labelList: {
      marginLeft: 16,
      marginTop: 8,
      "& > *": {
        width: 32,
        height: 20,
      },
      "& > * + *": {
        marginLeft: 8,
      },
    },
  })
);

const congestions = [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.1];
const congestionLabels = [0, 20, 40, 60, 80, 100];

export const CongestionExample: React.VFC = () => {
  const classes = useCongestionExampleStyles();
  const theme = useTheme<Theme>();

  return (
    <div className={classes.root}>
      <div className={clsx(classes.wrapper, classes.colorList)}>
        {congestions.map((congestion) => (
          <span
            key={congestion}
            style={{
              backgroundColor: congestionColor(congestion, theme.palette.type)
                .main,
            }}
          />
        ))}
      </div>
      <div className={clsx(classes.wrapper, classes.labelList)}>
        {congestionLabels.map((congestionLabel) => (
          <Typography
            key={congestionLabel}
            align="center"
            variant="body2"
            color="textSecondary"
          >
            {`${congestionLabel}%`}
          </Typography>
        ))}
      </div>
    </div>
  );
};

type RoomInfo = { x: number; y: number; width?: number; height?: number };

const _lowerNormalClassrooms: RoomInfo[] = [
  { x: 576, y: 320 },
  { x: 576, y: 384 },
  { x: 576, y: 448 },
  { x: 576, y: 512 },
  { x: 512, y: 576 },
  { x: 448, y: 576 },
  { x: 384, y: 576 },
  { x: 320, y: 576 },
  { x: 256, y: 512 },
  { x: 256, y: 448 },
  { x: 256, y: 384 },
  { x: 256, y: 320 },
];

const _upperNormalClassrooms: RoomInfo[] = [
  { x: 320, y: 256 },
  { x: 384, y: 256 },
  { x: 448, y: 256 },
  { x: 512, y: 256 },
];

const arrToObj = (arr: RoomInfo[], elev: string, start = 1) =>
  Object.fromEntries(
    arr.map((info, index) => [elev + ("00" + (start + index)).slice(-2), info])
  );

const scienceRoom: RoomInfo = {
  x: 64,
  y: 224,
  width: 160,
  height: 96,
};

const rooms: {
  [key in "1F" | "2F" | "3F" | "4F"]: {
    [id: string]: { x: number; y: number; width?: number; height?: number };
  };
} = {
  "1F": {
    ...arrToObj(_lowerNormalClassrooms, "1"),
    "113": scienceRoom,
    // 講堂
    "114": {
      x: 320,
      y: 64,
      width: 256,
      height: 128,
    },
  },
  "2F": {
    ...arrToObj(_lowerNormalClassrooms, "2"),
    "213": scienceRoom,
    // 芸術棟
    "214": { x: 192, y: 64 },
    "215": { x: 128, y: 64 },
  },
  "3F": {
    "301": { x: 576, y: 96, width: 64, height: 96 },
    ...arrToObj(_lowerNormalClassrooms, "3", 2),
    ...arrToObj(_upperNormalClassrooms, "3", 16),
    "314": scienceRoom,
    // 芸術棟
    "315": { x: 128, y: 64, width: 128, height: 64 },
  },
  "4F": {
    // 大会議室
    "401": { x: 672, y: 64, width: 64, height: 128 },
    ...arrToObj(_upperNormalClassrooms.reverse(), "4", 2),
    "406": scienceRoom,
  },
};

const lines: {
  [key in "1F" | "2F" | "3F" | "4F"]: string[];
} = {
  "1F": [
    "224 256 256 256",
    "288 256 320 256 320 320",
    "608 256 576 256 576 320",
    "640 256 672 256 672 608 608 608 608 672 288 672 288 640 256 640 256 608 224 608 224 320",
  ],
  "2F": [
    "128 128 128 160 224 160 224 608 256 608 256 640 288 640 288 672 608 672 608 608 672 608 672 256 576 256 576 320",
    "320 320 320 256 256 256 256 128",
  ],
  "3F": [
    "256 128 256 224 640 224 640 96",
    "672 64 576 64 576 96",
    "128 128 128 160 224 160 224 608 256 608 256 640 288 640 288 672 608 672 608 608 672 608 672 64",
  ],
  "4F": [
    "224 224 640 224 640 96 576 96 576 64 672 64",
    "672 192 672 320 576 320",
    "224 320 320 320",
  ],
};
