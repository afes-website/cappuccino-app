import React from "react";
import api from "@afes-website/docs";
import GuestScan from "components/GuestScan";
import { useAspidaClient, useAuthState } from "hooks/auth/useAuth";
import { useRequirePermission } from "hooks/auth/useRequirePermission";
import { useTitleSet } from "libs/title";

const ExitScan: React.VFC = () => {
  useTitleSet("展示教室 退室スキャン");
  useRequirePermission("exhibition");

  const aspida = useAspidaClient();
  const { currentUser, currentUserId } = useAuthState();

  return (
    <GuestScan
      handleScan={(guestId) =>
        api(aspida)
          .guests._id(guestId)
          .exit.$post({
            headers: {
              Authorization: "bearer " + currentUser?.token,
            },
            body: {
              exhibition_id: currentUserId ?? "",
            },
          })
      }
      page="exhibition/exit"
    />
  );
};

export default ExitScan;
