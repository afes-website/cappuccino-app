import React, { useContext, useEffect, useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  createStyles,
  makeStyles,
  Paper,
  Theme,
} from "@material-ui/core";
import routes from "libs/routes";
import { Link, useHistory } from "react-router-dom";
import { Home } from "@material-ui/icons";
import { Login, Logout, QRScannerIcon } from "components/MaterialSvgIcons";
import { AuthContext } from "libs/auth";
import { UserInfo } from "@afes-website/docs";
import clsx from "clsx";

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
  })
);

const BottomNav: React.FC<{ className?: string }> = ({ className }) => {
  const history = useHistory();
  const classes = useStyles();
  const [value, setValue] = useState(history.location.pathname);
  const auth = useContext(AuthContext).val;

  const get_menus = () => {
    const menus: MenuItem[] = [];
    menus.push(...commonMenus);
    const _perm:
      | { [name: string]: boolean }
      | undefined = auth.get_current_user()?.permissions;
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
    <Paper elevation={6} className={clsx(classes.root, className)}>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels={true}
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
    ["入場処理", routes.CheckInScan.route.create({}), <Login key="Enter" />],
    ["退場処理", routes.CheckOutScan.route.create({}), <Logout key="Exit" />],
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
