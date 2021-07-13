import React, { useContext, useEffect, useState } from "react";
import { Card, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { AuthContext } from "libs/auth";
import api, { ExhibitionStatus } from "@afes-website/docs";
import aspida from "@aspida/axios";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    title: {
      marginBottom: theme.spacing(1.5),
    },
  })
);

const ExhInfoCard: React.VFC = () => {
  const auth = useContext(AuthContext).val;
  const classes = useStyles();

  const [exhInfo, setExhInfo] = useState<ExhibitionStatus | null>(null);

  const getExhInfo = () => {
    const user = auth.get_current_user();
    if (!user || !user.permissions.exhibition) return;
    api(aspida())
      .exhibitions._id(user.id)
      .$get({ headers: { Authorization: "bearer " + user.token } })
      .then((_exhInfo) => {
        setExhInfo(_exhInfo);
      });
  };

  useEffect(getExhInfo, [auth]);

  return (
    <Card className={classes.root}>
      <Typography variant="h5" component="h2" className={classes.title}>
        {exhInfo ? exhInfo.info.name : <Skeleton />}
      </Typography>
      <Typography variant="body2">
        {exhInfo ? (
          `${exhInfo.info.room_id} ･ @${auth.get_current_user_id()}`
        ) : (
          <Skeleton />
        )}
      </Typography>
    </Card>
  );
};

export default ExhInfoCard;
