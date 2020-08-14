import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import routes from "@/libs/routes";
import HomeCard from "@/components/homeCard";

const useStyles = makeStyles({
  root: {
    padding: "10px",
  },
});

const Home: React.FunctionComponent = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <HomeCard
        title="入退場 QRコードスキャン"
        paragraphs={[
          "自展示への入退室者のリストバンドのQRコードを読み取ることで、入退室処理を行えます。",
          "画面に案内が出た場合は、表示された内容を来場者に案内してください。",
        ]}
        buttons={[
          ["入室スキャン", routes.Scan],
          ["退室スキャン", routes.Scan],
        ]}
      />
      <HomeCard
        title="QRコードスキャン履歴"
        paragraphs={["自展示への来場者の入退室履歴を閲覧できます。"]}
        buttons={[["履歴照会", routes.Scan]]}
      />
    </div>
  );
};

export default Home;
