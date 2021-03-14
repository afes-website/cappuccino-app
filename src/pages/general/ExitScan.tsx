import React, { useContext } from "react";
import { useTitleSet } from "@/libs/title";
import { AuthContext, useVerifyPermission } from "@/libs/auth";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import GuestScan from "@/components/GuestScan";

const ExitScan: React.FC = () => {
  useTitleSet("文化祭 退場スキャン");
  useVerifyPermission("general");
  const auth = useContext(AuthContext).val;

  return (
    <GuestScan
      handleScan={(guestId) =>
        api(aspida()).onsite.general.exit.$post({
          body: {
            guest_id: guestId,
          },
          headers: {
            Authorization: "bearer " + auth.get_current_user()?.token,
          },
        })
      }
      page="general/exit"
    />
  );
};

export default ExitScan;
