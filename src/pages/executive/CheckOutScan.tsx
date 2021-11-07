import React from "react";
import api from "@afes-website/docs";
import GuestScan from "components/GuestScan";
import { useAspidaClient, useAuthState } from "hooks/auth/useAuth";
import { useRequirePermission } from "hooks/auth/useRequirePermission";
import { useTitleSet } from "libs/title";

const CheckOutScan: React.VFC = () => {
  useTitleSet("文化祭 退場スキャン");
  useRequirePermission("executive");
  const aspida = useAspidaClient();
  const { currentUser } = useAuthState();

  return (
    <GuestScan
      handleScan={(guestId) =>
        api(aspida)
          .guests._id(guestId)
          .check_out.$post({
            headers: {
              Authorization: "bearer " + currentUser?.token,
            },
          })
      }
      page="executive/check-out"
    />
  );
};

export default CheckOutScan;
