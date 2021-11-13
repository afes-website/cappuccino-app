import React, { useCallback, useEffect, useState } from "react";
import api from "@afes-website/docs";
import { Card, CardContent } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import GuestScan from "components/GuestScan";
import { useAspidaClient, useAuthState } from "hooks/auth/useAuth";
import { useRequirePermission } from "hooks/auth/useRequirePermission";
import useDots from "hooks/useDots";
import { useTitleSet } from "libs/title";

const useStyles = makeStyles(() =>
  createStyles({
    noPadding: {
      padding: "0 !important",
      objectFit: "cover",
    },
  })
);

const EnterScan: React.VFC = () => {
  useTitleSet("展示教室 入室スキャン");
  useRequirePermission("exhibition");

  const classes = useStyles();

  const aspida = useAspidaClient();
  const { currentUser, currentUserId } = useAuthState();

  const [isFull, setIsFull] = useState<boolean>(false);

  const checkIsFull = useCallback(() => {
    api(aspida)
      .exhibitions._id(currentUser?.id || "")
      .$get()
      .then((status) => {
        const sum = Object.values(status.count).reduce(
          (prev, curr) => prev + curr,
          0
        );
        setIsFull(sum >= status.capacity);
      })
      .catch(() => {
        setIsFull(false);
      });
  }, [aspida, currentUser?.id]);

  useEffect(() => {
    checkIsFull();
    const intervalId = setInterval(checkIsFull, 15000);
    return () => clearInterval(intervalId);
  }, [checkIsFull]);

  const dots = useDots(400);

  return (
    <GuestScan
      handleScan={(guestId) =>
        api(aspida)
          .guests._id(guestId)
          .enter.$post({
            headers: {
              Authorization: "bearer " + currentUser?.token,
            },
            body: {
              exhibition_id: currentUserId ?? "",
            },
          })
          .then((guest) => {
            checkIsFull();
            return guest;
          })
      }
      page="exhibition/enter"
      extraStatus={isFull ? "warning" : undefined}
      additionalContent={
        isFull && (
          <Card>
            <CardContent className={classes.noPadding}>
              <Alert severity="warning">展示内は現在満員です{dots}</Alert>
            </CardContent>
          </Card>
        )
      }
    />
  );
};

export default EnterScan;
