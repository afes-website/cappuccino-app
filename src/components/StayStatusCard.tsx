import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import StayStatus from "components/StayStatus";
import { useAuthState } from "libs/auth/useAuth";
import routes from "libs/routes";
import api, { ExhibitionStatus, Terms } from "@afes-website/docs";
import { useAspidaClient } from "components/AspidaClientContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginBottom: theme.spacing(1.5),
    },
    paragraph: {
      marginBottom: theme.spacing(2),
    },
  })
);

type Status = Pick<ExhibitionStatus, "count" | "capacity">;

const StatusCard: React.VFC<
  PropsWithChildren<{
    title: string;
    paragraph: string;
    // useCallback を通すこと！
    getStatus: () => Promise<Status>;
    showCountLimit: boolean;
  }>
> = ({ children, getStatus, ...props }) => {
  const { currentUser } = useAuthState();
  const classes = useStyles();
  const aspida = useAspidaClient();

  const [status, setStatus] = useState<Status | null>(null);
  const [terms, setTerms] = useState<Terms | null>(null);

  useEffect(() => {
    getStatus().then((status) => {
      setStatus(status);
    });
    api(aspida)
      .terms.$get({
        headers: {
          Authorization: "bearer " + currentUser?.token,
        },
      })
      .then((terms) => {
        setTerms(terms);
      });
  }, [aspida, currentUser?.token, getStatus]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" className={classes.title}>
          {props.title}
        </Typography>
        <Typography
          variant="body2"
          paragraph={true}
          className={classes.paragraph}
        >
          {props.paragraph}
        </Typography>
        <StayStatus
          statusCount={status?.count || null}
          limit={(props.showCountLimit && status?.capacity) || null}
          terms={terms || null}
        />
      </CardContent>
      {children}
    </Card>
  );
};

const useHomeCardStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginBottom: theme.spacing(1.5),
    },
    paragraph: {
      marginBottom: theme.spacing(2),
    },
    actionsWrapper: {
      position: "relative",
      display: "flex",
      justifyContent: "space-around",
      padding: theme.spacing(0.5),
    },
    // divider: {
    //   position: "absolute",
    //   top: 0,
    //   left: "50%",
    // },
  })
);

export const GeneralStatusCard: React.VFC = () => {
  const classes = useHomeCardStyles();
  const aspida = useAspidaClient();

  const getStatus = useCallback(
    () =>
      api(aspida)
        .exhibitions.$get()
        .then((status) => status.all),
    [aspida]
  );

  return (
    <StatusCard
      title="校内の滞在状況"
      paragraph="校内の来場者の滞在状況です。"
      getStatus={getStatus}
      showCountLimit={false}
    >
      <>
        <Divider />
        <CardActions className={classes.actionsWrapper} disableSpacing>
          <Button
            color="secondary"
            component={Link}
            to={routes.AllExhStatus.route.create({})}
          >
            全展示の滞在状況一覧
          </Button>
        </CardActions>
      </>
    </StatusCard>
  );
};

export const ExhStatusCard: React.VFC = () => {
  const { currentUser } = useAuthState();
  const aspida = useAspidaClient();

  const getStatus = useCallback(
    () =>
      api(aspida)
        .exhibitions._id(currentUser?.id || "")
        .$get(),
    [aspida, currentUser?.id]
  );

  return (
    <StatusCard
      title="展示内の滞在状況"
      paragraph="展示内の来場者の滞在状況です。"
      getStatus={getStatus}
      showCountLimit={true}
    />
  );
};
