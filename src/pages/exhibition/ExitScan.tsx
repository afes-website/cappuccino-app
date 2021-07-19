import React from "react";
import { useTitleSet } from "libs/title";
import { useAuthState } from "libs/auth/useAuth";
import { useVerifyPermission } from "libs/auth/useVerifyPermission";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import GuestScan from "components/GuestScan";

const ExitScan: React.VFC = () => {
  useTitleSet("展示教室 退室スキャン");
  useVerifyPermission("exhibition");
  const { currentUser, currentUserId } = useAuthState();

  return (
    <GuestScan
      handleScan={(guestId) =>
        api(aspida())
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
