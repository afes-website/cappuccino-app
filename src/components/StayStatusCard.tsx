import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import StayStatus from "components/StayStatus";
import { useAspidaClient, useAuthState } from "libs/auth/useAuth";
import api, { ExhibitionStatus, Terms } from "@afes-website/docs";

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
    <StatusCard getStatus={getStatus} showCountLimit={false}>
      {children}
    </StatusCard>
  );
};

export const ExhStatusCard: React.VFC<PropsWithChildren<unknown>> = ({
  children,
}) => {
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
      {children}
    </StatusCard>
  );
};
