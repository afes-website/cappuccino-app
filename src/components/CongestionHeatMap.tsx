import React, { useEffect, useState } from "react";
import api, { AllStatus } from "@afes-website/docs";
import aspida from "@aspida/axios";
import clsx from "clsx";
import {
  Grid,
  Theme,
  Typography,
  createStyles,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import congestionColor from "libs/congestionColor";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexDirection: "row-reverse",
      flexWrap: "wrap-reverse",
      // 画面幅の違いによる突き抜け防止
      marginTop: "calc(100% * 0.1)",
    },
    floor: {
      position: "relative",
      overflow: "hidden",
      // margin の基準は横幅なので、viewBox 比率
      margin: "calc(100% * 0.92 * 0.17 * -1) 0",
    },
    floorUpper: {
      [theme.breakpoints.up("md")]: {
        marginBottom: "calc(100% * 0.92 * 0.17 * -1)",
        marginTop: 0,
      },
    },
    floorLower: {
      [theme.breakpoints.up("md")]: {
        marginTop: "calc(100% * 0.92 * 0.17 * -1)",
        marginBottom: 0,
      },
    },
    path: {
      fill: "none",
      stroke: theme.palette.text.primary,
      strokeWidth: 4,
      strokeLinejoin: "round",
    },
    exhImgOutline: {
      fill: "none",
      stroke: "#fff",
      strokeWidth: 4,
    },
    floorNum: {
      position: "absolute",
      right: "15%",
      top: "20%",
    },
  })
);

interface Props {
  exhStatus: AllStatus | null;
  rotateDeg: number;
  scaleY: number;
}

const CongestionHeatMap: React.VFC<Props> = ({
  exhStatus,
  rotateDeg,
  scaleY,
}) => {
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

  const exhImageUrl = (roomId: string): string => {
    if (
      exhStatus &&
      Object.prototype.hasOwnProperty.call(exhIds, roomId) &&
      Object.prototype.hasOwnProperty.call(exhStatus.exhibition, exhIds[roomId])
    ) {
      return api(aspida())
        .images._id(
          exhStatus.exhibition[exhIds[roomId]].info.thumbnail_image_id
        )
        .$path({ query: { size: "s" } });
    }
    return "";
  };

  return (
    <Grid container spacing={2} className={classes.root}>
      {(["1F", "2F", "3F", "4F"] as const).map((floor, index) => (
        <Grid
          item
          xs={12}
          md={6}
          key={floor}
          className={clsx(
            classes.floor,
            [classes.floorUpper, classes.floorLower][index % 2]
          )}
        >
          <div style={{ transform: `scaleY(${scaleY})` }}>
            <svg
              style={{ transform: `rotate(${rotateDeg}deg)` }}
              viewBox="0 0 800 736"
            >
              {Object.entries(rooms[floor]).map(([id, info]) => (
                <>
                  <rect
                    key={id}
                    x={info.x}
                    y={info.y}
                    width={info.width ?? 64}
                    height={info.height ?? 64}
                    className={classes.path}
                    style={{ fill: fillColor(id) }}
                  />
                  {exhImageUrl(id) && (
                    <>
                      <image
                        x={info.x + (info.width ?? 64) / 2 - 25}
                        y={info.y + (info.height ?? 64) / 2 - 25}
                        width={50}
                        height={50}
                        href={exhImageUrl(id)}
                        clipPath="circle(25px)"
                        transform={`rotate(${-rotateDeg}, ${
                          info.x + (info.width ?? 64) / 2
                        }, ${info.y + (info.height ?? 64) / 2})`}
                      />
                      <circle
                        cx={info.x + (info.width ?? 64) / 2}
                        cy={info.y + (info.height ?? 64) / 2}
                        r={26}
                        transform={`rotate(${-rotateDeg}, ${
                          info.x + (info.width ?? 64) / 2
                        }, ${info.y + (info.height ?? 64) / 2})`}
                        className={classes.exhImgOutline}
                      />
                    </>
                  )}
                </>
              ))}
              {lines[floor].map((points, index) => (
                <polyline
                  key={index}
                  points={points}
                  className={classes.path}
                />
              ))}
            </svg>
          </div>
          <Typography
            className={classes.floorNum}
            variant="h5"
            color="textPrimary"
          >
            {floor}
          </Typography>
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
        width: 16,
        height: 16,
      },
      "& > * + *": {
        marginLeft: 16,
      },
    },
    labelList: {
      marginLeft: 8,
      marginTop: 8,
      "& > *": {
        width: 32,
        height: 20,
      },
      "& > * + *": {
        marginLeft: 0,
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
            variant="caption"
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

const arrToObj = (arr: RoomInfo[], floor: string, start = 1) =>
  Object.fromEntries(
    arr.map((info, index) => [floor + ("00" + (start + index)).slice(-2), info])
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
    "S1-1": scienceRoom,
    // 講堂
    "114": { x: 320, y: 64, width: 256, height: 128 },
    // train
    "106-107": { x: 384, y: 576, width: 128, height: 64 },
    // eating
    "109-112": { x: 224, y: 320, width: 96, height: 256 },
  },
  "2F": {
    ...arrToObj(_lowerNormalClassrooms, "2"),
    "S2-1": scienceRoom,
    // 芸術棟
    "S2-2": { x: 192, y: 64 },
    "S2-3": { x: 128, y: 64 },
  },
  "3F": {
    ...arrToObj(_lowerNormalClassrooms, "3", 1),
    ...arrToObj(_upperNormalClassrooms, "3", 13),
    "S3-1": scienceRoom,
    // 一音
    "S3-2": { x: 128, y: 64, width: 128, height: 64 },
    // 二音
    "S3-3": { x: 576, y: 96, width: 64, height: 96 },
    // frontierH1
    "F-301-304": { x: 576, y: 320, width: 96, height: 256 },
    // frontierH3
    "F-313-315": { x: 384, y: 224, width: 192, height: 96 },
  },
  "4F": {
    // 大会議室
    "S4-3": { x: 672, y: 64, width: 64, height: 128 },
    ...arrToObj(_upperNormalClassrooms.reverse(), "4", 0),
    // 化大
    "S4-1": scienceRoom,
    // 化小
    "S4-2": {
      x: 160,
      y: 160,
    },
  },
};

const lines: {
  [key in "1F" | "2F" | "3F" | "4F"]: string[];
} = {
  "1F": [
    "224 256 256 256",
    "288 256 320 256 320 320",
    "608 256 576 256 576 320",
    "640 256 672 256 672 608 608 608 608 672 288 672 288 640 ",
    "256 608 224 608 224 320",
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
