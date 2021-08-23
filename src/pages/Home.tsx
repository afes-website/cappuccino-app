import React from "react";
import routes from "libs/routes";
import HomeCard from "components/HomeCard";
import CardList from "components/CardList";
import PwaAlertCard from "components/PwaAlertCard";
import { GeneralStatusCard, ExhStatusCard } from "components/StayStatusCard";
import ExhInfoCard from "components/ExhInfoCard";
import { useAuthState } from "libs/auth/useAuth";
import { verifyPermission } from "libs/auth/useRequirePermission";
import { useTitleSet } from "libs/title";

const Home: React.VFC = () => {
  useTitleSet("CAPPUCCINO");
  const { currentUser } = useAuthState();

  return (
    <CardList>
      <PwaAlertCard />
      {verifyPermission("executive", currentUser) && (
        <>
          <GeneralStatusCard />
          <HomeCard
            title="文化祭 入退場 QRスキャン"
            paragraphs={[
              "文化祭入退場門にてリストバンドのQRコードを読み取ることで、文化祭の入退場処理を行います。",
              "画面に案内が出た場合は、表示された内容を来場者に案内してください。",
            ]}
            buttons={[
              ["入場スキャン", routes.CheckInScan.route.create({})],
              ["退場スキャン", routes.CheckOutScan.route.create({})],
            ]}
          />
        </>
      )}
      {verifyPermission("exhibition", currentUser) && (
        <>
          <ExhInfoCard />
          <ExhStatusCard />
          <HomeCard
            title="展示教室 入退室 QRスキャン"
            paragraphs={[
              "自展示への入退室者のリストバンドのQRコードを読み取ることで、展示の入退室処理を行います。",
              "画面に案内が出た場合は、表示された内容を来場者に案内してください。",
            ]}
            buttons={[
              ["入室スキャン", routes.EnterScan.route.create({})],
              ["退室スキャン", routes.ExitScan.route.create({})],
            ]}
          />
          <HomeCard
            title="入退室スキャン履歴"
            paragraphs={["自展示の入退室履歴をすべて表示します。"]}
            buttons={[["スキャン履歴", routes.ScanHistory.route.create({})]]}
          />
        </>
      )}
    </CardList>
  );
};

export default Home;
