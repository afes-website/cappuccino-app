import React from "react";
import routes from "@/libs/routes";
import HomeCard from "@/components/HomeCard";
import CardList from "@/components/CardList";
import { useTitleSet } from "@/libs/title";

const Home: React.FunctionComponent = () => {
  useTitleSet("Manager for Exhibition");

  return (
    <CardList>
      <HomeCard
        title="入退場 QRコードスキャン"
        paragraphs={[
          "文化祭入退場門にてリストバンドのQRコードを読み取ることで、入退場処理を行えます。",
          "画面に案内が出た場合は、表示された内容を来場者に案内してください。",
        ]}
        buttons={[
          ["入場スキャン", routes.GeneralEnterScan.route.create({})],
          ["退場スキャン", routes.GeneralExitScan.route.create({})],
        ]}
      />
      <HomeCard
        title="入退室 QRコードスキャン"
        paragraphs={[
          "自展示への入退室者のリストバンドのQRコードを読み取ることで、入退室処理を行えます。",
          "画面に案内が出た場合は、表示された内容を来場者に案内してください。",
        ]}
        buttons={[
          ["入室スキャン", routes.ExhEnterScan.route.create({})],
          ["退室スキャン", routes.ExhEnterScan.route.create({})],
        ]}
      />
      <HomeCard
        title="QRコードスキャン履歴"
        paragraphs={["自展示への来場者の入退室履歴を閲覧できます。"]}
        buttons={[["履歴照会", routes.ExhEnterScan.route.create({})]]}
      />
    </CardList>
  );
};

export default Home;
