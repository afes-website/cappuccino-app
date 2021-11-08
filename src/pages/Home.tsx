import React from "react";
import { Card, Typography } from "@material-ui/core";
import { History, Map, NotListedLocation, Room } from "@material-ui/icons";
import CardList from "components/CardList";
import CardMenu from "components/CardMenu";
import { Login, Logout, QRScannerIcon } from "components/MaterialSvgIcons";
import PwaAlertCard from "components/PwaAlertCard";
import { ExhStatusCard, GeneralStatusCard } from "components/StayStatusCard";
import { useAuthState } from "hooks/auth/useAuth";
import { verifyPermission } from "hooks/auth/useRequirePermission";
import routes from "libs/routes";
import { useTitleSet } from "libs/title";

const Home: React.VFC = () => {
  useTitleSet("CAPPUCCINO");
  const { currentUser } = useAuthState();

  return (
    <CardList>
      <PwaAlertCard />
      {verifyPermission("executive", currentUser) && (
        <>
          <div>
            <Typography variant="overline">文化祭入退場処理</Typography>
            <Card>
              <CardMenu
                items={[
                  {
                    primary: "文化祭入場 QRスキャン",
                    secondary: "文化祭への入場処理",
                    to: routes.CheckInScan.route.create({}),
                    icon: <Login />,
                  },
                  {
                    primary: "文化祭退場 QRスキャン",
                    secondary: "文化祭からの退場処理",
                    to: routes.CheckOutScan.route.create({}),
                    icon: <Logout />,
                  },
                  {
                    primary: "入場待機列 予約確認スキャン",
                    secondary: "来場者の予約を事前に確認",
                    to: routes.GuestInfo.route.create({}),
                    icon: <QRScannerIcon />,
                  },
                ]}
              />
            </Card>
          </div>
          <div>
            <Typography variant="overline">校内の滞在状況</Typography>
            <GeneralStatusCard>
              <CardMenu
                items={[
                  {
                    primary: "全展示の滞在状況",
                    secondary: "展示別の滞在状況を一覧で表示",
                    to: routes.AllExhStatus.route.create({}),
                    icon: <Room />,
                  },
                  {
                    primary: "混雑状況ヒートマップ",
                    secondary: "校内の混雑状況を地図で表示",
                    to: routes.HeatMap.route.create({}),
                    icon: <Map />,
                  },
                ]}
              />
            </GeneralStatusCard>
          </div>
          <div>
            <Typography variant="overline">情報照会</Typography>
            <Card>
              <CardMenu
                items={[
                  {
                    primary: "予約・来場者情報照会",
                    secondary: "登録情報・行動履歴を表示",
                    to: routes.GuestInfo.route.create({}),
                    icon: <QRScannerIcon />,
                  },
                  {
                    primary: "予備リストバンド登録",
                    secondary: "紛失者用リストバンドの登録処理",
                    to: routes.RegisterSpare.route.create({}),
                    icon: <NotListedLocation />,
                  },
                ]}
              />
            </Card>
          </div>
        </>
      )}
      {verifyPermission("exhibition", currentUser) && (
        <>
          <div>
            <Typography variant="overline">展示内の滞在状況</Typography>
            <ExhStatusCard />
          </div>
          <div>
            <Typography variant="overline">入退室処理</Typography>
            <Card>
              <CardMenu
                items={[
                  {
                    primary: "展示入室 QRスキャン",
                    secondary: "自展示への入室処理",
                    to: routes.EnterScan.route.create({}),
                    icon: <Login />,
                  },
                  {
                    primary: "展示退室 QRスキャン",
                    secondary: "自展示からの退室処理",
                    to: routes.ExitScan.route.create({}),
                    icon: <Logout />,
                  },
                  {
                    primary: "入退室スキャン履歴",
                    secondary: "自展示の入退室履歴を表示",
                    to: routes.ScanHistory.route.create({}),
                    icon: <History />,
                  },
                ]}
              />
            </Card>
          </div>
        </>
      )}
    </CardList>
  );
};

export default Home;
