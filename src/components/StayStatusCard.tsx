import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import api, { ExhibitionStatus, Terms } from "@afes-website/docs";
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Skeleton } from "@material-ui/lab";
import AccountIcon from "components/AccountIcon";
import StayStatus from "components/StayStatus";
import { useAspidaClient, useAuthState } from "hooks/auth/useAuth";

const useStyles = makeStyles((theme) =>
  createStyles({
    cardContent: {
      // override
      "&:last-child": {
        paddingBottom: 16,
      },
    },
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
    title?: string;
    paragraph?: string;
    hideStudent?: boolean;
    // useCallback を通すこと！
    getStatus: () => Promise<Status>;
    showCountLimit: boolean;
  }>
> = ({ children, getStatus, hideStudent, ...props }) => {
  const { currentUser } = useAuthState();
  const classes = useStyles();
  const aspida = useAspidaClient();

  const [status, setStatus] = useState<Status | null>(null);
  const [terms, setTerms] = useState<Terms | null>(null);

  const load = useCallback(() => {
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

  useEffect(() => {
    load();
    const intervalId = setInterval(load, 20000);
    return () => clearInterval(intervalId);
  }, [load]);

  return (
    <Card>
      {children}
      <CardContent className={classes.cardContent}>
        {props.title && (
          <Typography variant="h5" component="h2" className={classes.title}>
            {props.title}
          </Typography>
        )}
        {props.paragraph && (
          <Typography
            variant="body2"
            paragraph={true}
            className={classes.paragraph}
          >
            {props.paragraph}
          </Typography>
        )}
        <StayStatus
          statusCount={status?.count || null}
          limit={(props.showCountLimit && status?.capacity) || null}
          terms={terms || null}
          hideStudent={hideStudent}
        />
      </CardContent>
    </Card>
  );
};

export const GeneralStatusCard: React.VFC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const aspida = useAspidaClient();

  const getStatus = useCallback(
    () =>
      api(aspida)
        .exhibitions.$get()
        .then((status) => status.all),
    [aspida]
  );

  return (
    <StatusCard getStatus={getStatus} showCountLimit={false} hideStudent>
      {children}
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
    <StatusCard getStatus={getStatus} showCountLimit={true}>
      <CardExhInfo />
    </StatusCard>
  );
};

const CardExhInfo: React.VFC = () => {
  const { currentUser } = useAuthState();
  const aspida = useAspidaClient();

  const [exhInfo, setExhInfo] = useState<ExhibitionStatus | null>(null);

  useEffect(() => {
    if (!currentUser || !currentUser.permissions.exhibition) return;
    api(aspida)
      .exhibitions._id(currentUser.id)
      .$get()
      .then((_exhInfo) => {
        setExhInfo(_exhInfo);
      });
  }, [aspida, currentUser]);

  return (
    <List dense={true} style={{ marginBottom: -16 }}>
      <ListItem>
        <ListItemIcon>
          <AccountIcon account={currentUser} />
        </ListItemIcon>
        <ListItemText
          primary={exhInfo ? exhInfo.info.name : <Skeleton />}
          secondary={
            exhInfo ? (
              `${exhInfo.info.room_id} ･ @${currentUser?.id}`
            ) : (
              <Skeleton />
            )
          }
        />
      </ListItem>
    </List>
  );
};
