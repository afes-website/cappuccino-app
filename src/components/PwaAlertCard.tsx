import React from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Card } from "@material-ui/core";

const PwaAlertCard: React.FC = () => {
  if (window.matchMedia("(display-mode: standalone)").matches) return null;
  return (
    <Card>
      <Alert severity="warning">
        <AlertTitle>ウェブアプリとしてインストール</AlertTitle>
        <p>
          お使いの環境はウェブアプリではありません。アプリとして使えるように、ホーム画面に追加してください。
        </p>
      </Alert>
    </Card>
  );
};

export default PwaAlertCard;
