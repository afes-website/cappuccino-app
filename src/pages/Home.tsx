import React, { useContext } from "react";
import routes from "libs/routes";
import HomeCard from "components/HomeCard";
import CardList from "components/CardList";
import { GeneralStatusCard, ExhStatusCard } from "components/StayStatusCard";
import { useTitleSet } from "libs/title";
import { AuthContext, verifyPermission } from "libs/auth";
import PwaAlertCard from "../components/PwaAlertCard";

const Home: React.FC = () => {
  useTitleSet("CAPPUCCINO");
  const auth = useContext(AuthContext).val;

  return (
    <CardList>
      <PwaAlertCard />
      {verifyPermission("general", auth) && (
        <>
          <GeneralStatusCard />
          <HomeCard
            title="文化祭 入退場 QRスキャン"
            paragraphs={[
              "文化祭入退場門にてリストバンドのQRコードを読み取ることで、文化祭の入退場処理を行います。",
              "画面に案内が出た場合は、表示された内容を来場者に案内してください。",
            ]}
            buttons={[
              ["入場スキャン", routes.GeneralEnterScan.route.create({})],
              ["退場スキャン", routes.GeneralExitScan.route.create({})],
            ]}
          />
        </>
      )}
      {verifyPermission("exhibition", auth) && (
        <>
          <HomeCard
            title="展示教室 入退室 QRスキャン"
            paragraphs={[
              "自展示への入退室者のリストバンドのQRコードを読み取ることで、展示の入退室処理を行います。",
              "画面に案内が出た場合は、表示された内容を来場者に案内してください。",
            ]}
            buttons={[
              ["入室スキャン", routes.ExhEnterScan.route.create({})],
              ["退室スキャン", routes.ExhExitScan.route.create({})],
            ]}
          />
          <ExhStatusCard />
          <HomeCard
            title="入退室スキャン履歴"
            paragraphs={["自展示の入退室履歴をすべて表示します。"]}
            buttons={[["スキャン履歴", routes.ExhScanHistory.route.create({})]]}
          />
        </>
      )}
    </CardList>
  );
};

export default Home;
