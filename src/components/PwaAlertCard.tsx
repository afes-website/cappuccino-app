import React, { useState } from "react";
import { Card, createStyles, IconButton, makeStyles } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import {
  AddBoxOutlined,
  AddToHomeScreen,
  ExpandLess,
  ExpandMore,
  Launch,
  MoreVert,
} from "@material-ui/icons";
import { IosShare } from "./MaterialSvgIcons";
import UAParser from "ua-parser-js";

const useStyles = makeStyles((theme) =>
  createStyles({
    list: {
      paddingLeft: theme.spacing(2),
    },
    alert: {
      position: "relative",
    },
    alertTitle: {
      margin: 0,
      fontSize: 14,
    },
    alertActionButton: {
      position: "absolute",
      top: 9,
      right: 9,
    },
    inlineIcon: {
      display: "inline-block",
      position: "relative",
      top: 5,
      margin: "0 2px",
      height: 20,
    },
  })
);

const storageKey = "pwaAlertOpen";

const PwaAlertCard: React.FC = () => {
  const classes = useStyles();
  const [open, _setOpen] = useState<boolean>(
    !!parseInt(localStorage.getItem(storageKey) ?? "1")
  );
  const toggleOpen = () => {
    localStorage.setItem(storageKey, !open ? "1" : "0");
    _setOpen(!open);
  };

  const parser = new UAParser(navigator.userAgent);

  // すでに PWA
  if (window.matchMedia("(display-mode: standalone)").matches) return null;

  // スマホでもタブレットでもない（パソコンなど）
  if (
    !(
      parser.getDevice().type === "mobile" ||
      parser.getDevice().type === "tablet"
    )
  )
    return null;

  return (
    <Card>
      <Alert severity="warning" className={classes.alert}>
        <AlertTitle className={classes.alertTitle}>
          ホーム画面に追加してください
        </AlertTitle>
        {open && (
          <>
            <p>以下の手順でアプリを追加してください。</p>
            <ol className={classes.list}>
              <HowToInstall />
              <li>ホーム画面に追加されたアイコンをタップして起動する</li>
            </ol>
            <p>
              また、すでにインストール済みの場合はホーム画面から起動してください。
            </p>
          </>
        )}
        <IconButton
          size="small"
          color="inherit"
          onClick={toggleOpen}
          className={classes.alertActionButton}
        >
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Alert>
    </Card>
  );
};

const HowToInstall: React.FC = () => {
  const classes = useStyles();

  const parser = new UAParser(navigator.userAgent);

  if (parser.getDevice().vendor === "Apple") {
    // iOS・iPadOS Safari
    if (parser.getBrowser().name === "Mobile Safari")
      return (
        <li>
          <IosShare className={classes.inlineIcon} />
          メニューから「ホーム画面に追加
          <AddBoxOutlined className={classes.inlineIcon} />
          」を選択する
        </li>
      );
    // iOS iPadOS Chrome, Line, etc...
    return (
      <>
        <li>
          Safari でこのページを開く（{parser.getBrowser().name}{" "}
          からはホーム画面に追加できません）
        </li>
        <li>
          <IosShare className={classes.inlineIcon} />
          メニューから「ホーム画面に追加
          <AddBoxOutlined className={classes.inlineIcon} />
          」を選択する
        </li>
      </>
    );
  }
  // Android Chrome
  if (parser.getBrowser().name === "Chrome")
    return (
      <li>
        右上の
        <MoreVert className={classes.inlineIcon} />
        メニューから「
        <AddToHomeScreen className={classes.inlineIcon} />
        アプリをインストール」を選ぶ
      </li>
    );
  // Android Firefox
  if (parser.getBrowser().name === "Firefox")
    return (
      <li>
        ツールバー右端の
        <MoreVert className={classes.inlineIcon} />
        メニューから「
        <AddToHomeScreen className={classes.inlineIcon} />
        インストール」を選ぶ
      </li>
    );
  // Android Line
  if (parser.getBrowser().name === "Line")
    return (
      <>
        <li>
          右上の
          <MoreVert className={classes.inlineIcon} />
          メニューから「
          <Launch className={classes.inlineIcon} />
          他のアプリで開く」を選び、Chrome などを起動する（LINE
          ブラウザからはインストールできません）
        </li>
        <li>
          似たようなメッセージが表示されるので、画面の指示に従ってホーム画面に追加
        </li>
      </>
    );
  // unknown
  return (
    <li>
      不明なブラウザ（{parser.getBrowser().name}
      ）です。ブラウザのヘルプを確認するか、Chrome をお試しください。
    </li>
  );
};

export default PwaAlertCard;
