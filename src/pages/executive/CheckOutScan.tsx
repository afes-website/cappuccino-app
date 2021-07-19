import React from "react";
import { useTitleSet } from "libs/title";
import { useAuthState } from "libs/auth/useAuth";
import { useVerifyPermission } from "libs/auth/useVerifyPermission";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import GuestScan from "components/GuestScan";

const CheckOutScan: React.VFC = () => {
  useTitleSet("文化祭 退場スキャン");
  useVerifyPermission("executive");
  const { currentUser } = useAuthState();

  return (
    <GuestScan
      handleScan={(guestId) =>
        api(aspida())
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
