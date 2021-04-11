import React, { useContext } from "react";
import { useTitleSet } from "libs/title";
import { AuthContext, useVerifyPermission } from "libs/auth";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import GuestScan from "components/GuestScan";

const CheckOutScan: React.FC = () => {
  useTitleSet("文化祭 退場スキャン");
  useVerifyPermission("executive");
  const auth = useContext(AuthContext).val;

  return (
    <GuestScan
      handleScan={(guestId) =>
        api(aspida())
          .guests._id(guestId)
          .check_out.$post({
            headers: {
              Authorization: "bearer " + auth.get_current_user()?.token,
            },
          })
      }
      page="executive/check-out"
    />
  );
};

export default CheckOutScan;
