import React, { useContext } from "react";
import { useTitleSet } from "libs/title";
import { AuthContext, useVerifyPermission } from "libs/auth";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import GuestScan from "components/GuestScan";

const ExitScan: React.VFC = () => {
  useTitleSet("展示教室 退室スキャン");
  useVerifyPermission("exhibition");
  const auth = useContext(AuthContext).val;

  return (
    <GuestScan
      handleScan={(guestId) =>
        api(aspida()).onsite.exhibition.exit.$post({
          body: {
            guest_id: guestId,
          },
          headers: {
            Authorization: "bearer " + auth.get_current_user()?.token,
          },
        })
      }
      page="exh/exit"
    />
  );
};

export default ExitScan;
