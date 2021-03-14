import React, { useContext } from "react";
import { useTitleSet } from "@/libs/title";
import { AuthContext, useVerifyPermission } from "@/libs/auth";
import api, { Guest } from "@afes-website/docs";
import aspida from "@aspida/axios";
import GuestScan from "@/components/GuestScan";

const EnterScan: React.FC = () => {
  useTitleSet("展示教室 入室スキャン");
  const auth = useContext(AuthContext).val;
  useVerifyPermission("exhibition");

  const handleScan = async (guestId: string): Promise<Guest> =>
    await api(aspida()).onsite.exhibition.enter.$post({
      body: {
        guest_id: guestId,
      },
      headers: {
        Authorization: "bearer " + auth.get_current_user()?.token,
      },
    });

  return <GuestScan handleScan={handleScan} />;
};

export default EnterScan;
