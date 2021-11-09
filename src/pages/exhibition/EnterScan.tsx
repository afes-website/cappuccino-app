import React, { useCallback, useEffect, useState } from "react";
import api from "@afes-website/docs";
import GuestScan from "components/GuestScan";
import { useAspidaClient, useAuthState } from "hooks/auth/useAuth";
import { useRequirePermission } from "hooks/auth/useRequirePermission";
import { useTitleSet } from "libs/title";

const EnterScan: React.VFC = () => {
  useTitleSet("展示教室 入室スキャン");
  useRequirePermission("exhibition");

  const aspida = useAspidaClient();
  const { currentUser, currentUserId } = useAuthState();

  const [isFull, setIsFull] = useState<boolean>(false);

  const checkIsFull = useCallback(async () => {
    const status = await api(aspida)
      .exhibitions._id(currentUser?.id || "")
      .$get();
    const sum = Object.values(status.count).reduce(
      (prev, curr) => prev + curr,
      0
    );

    setIsFull(sum >= status.capacity);
  }, [aspida, currentUser?.id]);

  useEffect(() => {
    checkIsFull();
    const intervalId = setInterval(checkIsFull, 15000);
    return () => clearInterval(intervalId);
  }, [checkIsFull]);

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
      }
      handleSuccess={checkIsFull}
      page="exhibition/enter"
      isFull={isFull}
    />
  );
};

export default EnterScan;
