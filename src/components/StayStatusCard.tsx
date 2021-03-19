import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/libs/auth";
import api, { ExhStatus, Terms } from "@afes-website/docs";
import aspida from "@aspida/axios";
import StayStatus from "@/components/StayStatus";
import { Card, CardContent, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";

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
          limit={status?.limit || null}
          terms={terms || null}
        />
      </CardContent>
    </Card>
  );
};

export const GeneralStatusCard: React.FC = () => {
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
    />
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
    />
  );
};
