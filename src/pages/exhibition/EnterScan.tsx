import React from "react";
import { useTitleSet } from "libs/title";
import { useAuth, useVerifyPermission } from "libs/auth";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import GuestScan from "components/GuestScan";

const EnterScan: React.VFC = () => {
  useTitleSet("展示教室 入室スキャン");
  useVerifyPermission("exhibition");
  const auth = useAuth();

  return (
    <GuestScan
      handleScan={(guestId) =>
        api(aspida())
          .guests._id(guestId)
          .enter.$post({
            headers: {
              Authorization: "bearer " + auth.get_current_user()?.token,
            },
            body: {
              exhibition_id: auth.get_current_user_id() || "",
            },
          })
      }
      page="exhibition/enter"
    />
  );
};

export default EnterScan;
