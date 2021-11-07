import React from "react";
import { useTitleSet } from "libs/title";
import { useAspidaClient, useAuthState } from "hooks/auth/useAuth";
import { useRequirePermission } from "hooks/auth/useRequirePermission";
import api from "@afes-website/docs";
import GuestScan from "components/GuestScan";

const EnterScan: React.VFC = () => {
  useTitleSet("展示教室 入室スキャン");
  useRequirePermission("exhibition");

  const aspida = useAspidaClient();
  const { currentUser, currentUserId } = useAuthState();

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
      page="exhibition/enter"
    />
  );
};

export default EnterScan;
