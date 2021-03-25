import React from "react";
import { Divider, Theme, Typography, useTheme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { PieChart, Pie, Cell } from "recharts";
import { Skeleton } from "@material-ui/lab";
import { useWristBandPaletteColor } from "@/libs/wristBandColor";
import { getStringTime } from "@/libs/stringDate";
import { compareTerm } from "@/libs/compare";
import { ExhStatus, Terms } from "@afes-website/docs";

const useStyles = makeStyles(() =>
  createStyles({
    main: {
      display: "flex",
      position: "relative",
      justifyContent: "space-between",
      alignItems: "center",
    },
    termList: {
      display: "grid",
      gridTemplateColumns: "26px 1fr 40px",
      textAlign: "right",
    },
    termColorBadge: {
      display: "block",
      width: 12,
      height: 12,
      borderRadius: 6,
      marginTop: 3,
    },
    chartWrapper: {
      position: "relative",
    },
    countSumBoxWrapper: {
      position: "absolute",
      top: 0,
      left: 0,
      width: 120,
      height: 120,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    countSum: {
      display: "inline",
      fontSize: 22,
    },
    countLimit: {
      display: "inline",
      fontSize: 14,
    },
  })
);

export interface StayStatusCardProps {
  statusCount: ExhStatus["count"] | null;
  limit: number | null;
  terms: Terms | null;
}

const StayStatus: React.FC<StayStatusCardProps> = ({
  statusCount,
  limit,
  terms,
}) => {
  const classes = useStyles();
  const wristBandPaletteColor = useWristBandPaletteColor();
  const theme = useTheme<Theme>();

  const sum: number = statusCount
    ? Object.values(statusCount).reduce((prev, curr) => prev + curr, 0)
    : 0;

  const statusCountArray: [string, number][] =
    statusCount && terms
      ? Object.entries(statusCount).sort(([a], [b]) => compareTerm(a, b, terms))
      : [];

  return (
    <div className={classes.main}>
      {statusCount && terms ? (
        <div className={classes.chartWrapper}>
          <StayStatusPieChart
            statusCountArray={statusCountArray}
            limit={limit}
            terms={terms}
          />
          <div className={classes.countSumBoxWrapper}>
            <span>
              <Typography className={classes.countSum}>{sum}</Typography>
              <Typography className={classes.countLimit}>
                {limit && `/${limit}`}人
              </Typography>
            </span>
          </div>
        </div>
      ) : (
        <Skeleton variant="circle" width={120} height={120} animation="wave" />
      )}
      <Divider orientation="vertical" flexItem />
      <div className={classes.termList}>
        {statusCount && terms ? (
          Object.keys(statusCount).length > 0 ? (
            statusCountArray.map(([termId, count], index) => (
              <>
                {termId in terms && (
                  <span
                    key={`termColorBadge-${index}`}
                    className={classes.termColorBadge}
                    style={{
                      background: wristBandPaletteColor(
                        terms[termId].guest_type
                      )[theme.palette.type === "light" ? "main" : "dark"],
                    }}
                  />
                )}
                <Typography key={`termTime-${index}`} variant="body2">
                  {termId in terms
                    ? terms[termId].guest_type === "StudentGray"
                      ? `生徒`
                      : `${getStringTime(
                          terms[termId].enter_scheduled_time
                        )} - ${getStringTime(
                          terms[termId].exit_scheduled_time
                        )}`
                    : termId}
                </Typography>
                <Typography key={`termCount-${index}`} variant="body2">
                  {`${count}人`}
                </Typography>
              </>
            ))
          ) : (
            <Typography
              align="center"
              variant="body2"
              color="textSecondary"
              style={{
                gridColumn: "1 / 4",
                margin: "auto 0",
              }}
            >
              来場者が展示に入ると
              <br />
              内訳が表示されます
            </Typography>
          )
        ) : (
          [...Array(5)].map((_, index) => (
            <>
              <Skeleton
                key={`circleSkeleton-${index}`}
                variant="circle"
                className={classes.termColorBadge}
                animation="wave"
              />
              <Skeleton
                key={`textSkeleton-${index}`}
                width={120}
                animation="wave"
                style={{
                  gridColumn: "2 / 4",
                }}
              />
            </>
          ))
        )}
      </div>
    </div>
  );
};

export default StayStatus;

// ======== StayStatusPieChart ========

const useChartStyles = makeStyles(() =>
  createStyles({
    shadowChart: {
      '& path[name="valid"]': {
        filter: "drop-shadow(1px 1px 4px #000)",
      },
    },
  })
);

interface StayStatusPieChartProps {
  statusCountArray: [string, number][];
  limit: number | null;
  terms: Terms;
}

const StayStatusPieChart: React.FC<StayStatusPieChartProps> = ({
  statusCountArray,
  limit,
  terms,
}) => {
  const wristBandPaletteColor = useWristBandPaletteColor();
  const theme = useTheme<Theme>();
  const classes = useChartStyles();

  const sum = statusCountArray
    .map(([, count]) => count)
    .reduce((prev, curr) => prev + curr, 0);

  let data = statusCountArray.map(([termId, count]) => {
    return {
      termId,
      count,
    };
  });

  let colors: string[] = statusCountArray.map(([termId]) =>
    termId in terms
      ? wristBandPaletteColor(terms[termId].guest_type)[
          theme.palette.type === "light" ? "main" : "dark"
        ]
      : "#ccc"
  );

  if (limit) {
    data = [...data, { termId: "None", count: limit - sum }];
    colors = [...colors, "transparent"];
  }

  return (
    <PieChart height={120} width={120}>
      <Pie
        data={[
          { key: "valid", value: sum },
          { key: "disabled", value: limit ? limit - sum : 1 },
        ]}
        dataKey="value"
        outerRadius={55}
        innerRadius={40}
        startAngle={90}
        endAngle={-270}
        paddingAngle={0}
        isAnimationActive={false}
        nameKey="key"
        fill={theme.palette.action.disabledBackground}
        stroke="none"
        className={classes.shadowChart}
      />
      <Pie
        data={data}
        dataKey="count"
        outerRadius={55}
        innerRadius={40}
        startAngle={90}
        endAngle={-270}
        paddingAngle={0}
        isAnimationActive={false}
        nameKey="termId"
        stroke="none"
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={colors[index]} />
        ))}
      </Pie>
    </PieChart>
  );
};
