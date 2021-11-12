import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserInfo } from "@afes-website/docs";
import clsx from "clsx";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Theme,
  Typography,
  createStyles,
  makeStyles,
} from "@material-ui/core";
import { CloudOff, Home, Map, Room } from "@material-ui/icons";
import { Login, Logout, QRScannerIcon } from "components/MaterialSvgIcons";
import { useAuthState } from "hooks/auth/useAuth";
import { useBulkUpdateState } from "hooks/bulkUpdate/useBulkUpdate";
import routes from "libs/routes";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "block",
      paddingBottom: "env(safe-area-inset-bottom)",
    },
    selected: {
      color: theme.palette.secondary.main + " !important",
    },
    button: {
      boxSizing: "border-box",
    },
    navOffline: {
      marginBottom: -24,
      zIndex: 10,
      transform: "translateY(-24px)",
      transition: "transform 0.5s",
    },
    offlineBanner: {
      background: theme.palette.warning.main,
      color: "#fff",
      bottom: 0,
      textAlign: "center",
      lineHeight: 1,
      padding: 2,
      zIndex: 0,
      "& svg": {
        height: 16,
        width: 16,
        marginRight: 8,
        marginBottom: -4,
      },
    },
  })
);

const BottomNav: React.VFC<{ className?: string }> = ({ className }) => {
  const history = useHistory();
  const classes = useStyles();
  const [value, setValue] = useState(history.location.pathname);
  const { currentUser } = useAuthState();
  const { onLine } = useBulkUpdateState();

  const get_menus = () => {
    const menus: MenuItem[] = [];
    menus.push(...commonMenus);
    const _perm: { [name: string]: boolean } | undefined =
      currentUser?.permissions;
    if (!_perm) return menus;
    Object.entries(menuItems).forEach(([key, items]) => {
      if (items && _perm[key]) menus.push(...items);
    });
    return menus;
  };

  useEffect(() => {
    setValue(history.location.pathname);
  }, [history.location.pathname]);

  return (
    <Paper elevation={3} className={clsx(classes.root, className)}>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels={true}
        className={clsx({ [classes.navOffline]: !onLine })}
      >
        {get_menus().map(([label, route, Component]) => {
          return (
            <BottomNavigationAction
              label={label}
              icon={Component}
              className={classes.button}
              classes={{
                selected: classes.selected,
              }}
              key={label}
              component={Link}
              to={route}
              value={route}
            />
          );
        })}
      </BottomNavigation>
      {!onLine && (
        <div className={classes.offlineBanner}>
          <Typography variant="caption">
            <CloudOff />
            インターネットに接続していません
          </Typography>
        </div>
      )}
    </Paper>
  );
};

export default BottomNav;

type MenuItem = [string, string, React.ReactNode];

const menuItems: { [key in keyof UserInfo["permissions"]]?: MenuItem[] } = {
  exhibition: [
    ["入室処理", routes.EnterScan.route.create({}), <Login key="Enter" />],
    ["退室処理", routes.ExitScan.route.create({}), <Logout key="Exit" />],
  ],
  executive: [
    ["滞在状況", routes.AllExhStatus.route.create({}), <Room key="Status" />],
    ["混雑状況", routes.HeatMap.route.create({}), <Map key="HeatMap" />],
    [
      "情報照会",
      routes.GuestInfo.route.create({}),
      <QRScannerIcon key="guestInfo" />,
    ],
  ],
};

const commonMenus: MenuItem[] = [
  ["ホーム", routes.Home.route.create({}), <Home key="Home" />],
];
