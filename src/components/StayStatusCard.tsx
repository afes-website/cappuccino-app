import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/libs/auth";
import api, { ExhStatus, Terms } from "@afes-website/docs";
import aspida from "@aspida/axios";
import StayStatus from "@/components/StayStatus";
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
import routes from "@/libs/routes";

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

type Status = Pick<ExhStatus, "count" | "limit">;

const StatusCard: React.FC<{
  title: string;
  paragraph: string;
  getStatus: () => Promise<Status>;
  showCountLimit: boolean;
  children?: React.ReactNode;
}> = (props) => {
  const auth = useContext(AuthContext).val;
  const classes = useStyles();

  const [status, setStatus] = useState<Status | null>(null);
  const [terms, setTerms] = useState<Terms | null>(null);

  useEffect(() => {
    props.getStatus().then((status) => {
      setStatus(status);
    });
    api(aspida())
      .onsite.general.term.$get({
        headers: {
          Authorization: "bearer " + auth.get_current_user()?.token,
        },
      })
      .then((terms) => {
        setTerms(terms);
      });
  }, [auth, props]);

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
          limit={(props.showCountLimit ? status?.limit : null) || null}
          terms={terms || null}
        />
      </CardContent>
      {props.children && props.children}
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

export const GeneralStatusCard: React.FC = () => {
  const classes = useHomeCardStyles();
  const auth = useContext(AuthContext).val;

  return (
    <StatusCard
      title="校内の滞在状況"
      paragraph="校内の来場者の滞在状況です。"
      getStatus={() =>
        api(aspida())
          .onsite.exhibition.status.$get({
            headers: {
              Authorization: "bearer " + auth.get_current_user()?.token,
            },
          })
          .then((status) => {
            return status.all;
          })
      }
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

export const ExhStatusCard: React.FC = () => {
  const auth = useContext(AuthContext).val;

  return (
    <StatusCard
      title="展示内の滞在状況"
      paragraph="展示内の来場者の滞在状況です。"
      getStatus={() =>
        api(aspida())
          .onsite.exhibition.status._id(auth.get_current_user_id() || "")
          .$get({
            headers: {
              Authorization: "bearer " + auth.get_current_user()?.token,
            },
          })
      }
      showCountLimit={true}
    />
  );
};
