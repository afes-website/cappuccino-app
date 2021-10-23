import React, { useEffect, useState } from "react";
import { Card, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import api, { ExhibitionStatus } from "@afes-website/docs";
import { useAspidaClient, useAuthState } from "libs/auth/useAuth";

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
  const { currentUser } = useAuthState();
  const classes = useStyles();
  const aspida = useAspidaClient();

  const [exhInfo, setExhInfo] = useState<ExhibitionStatus | null>(null);

  const getExhInfo = () => {
    if (!currentUser || !currentUser.permissions.exhibition) return;
    api(aspida)
      .exhibitions._id(currentUser.id)
      .$get()
      .then((_exhInfo) => {
        setExhInfo(_exhInfo);
      });
  };

  useEffect(getExhInfo, [aspida, currentUser]);

  if (!currentUser) return null;
  return (
    <Card className={classes.root}>
      <Typography variant="h5" component="h2" className={classes.title}>
        {exhInfo ? exhInfo.info.name : <Skeleton />}
      </Typography>
      <Typography variant="body2">
        {exhInfo ? (
          `${exhInfo.info.room_id} ･ @${currentUser.id}`
        ) : (
          <Skeleton />
        )}
      </Typography>
    </Card>
  );
};

export default ExhInfoCard;
