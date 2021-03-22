import React, { useContext, useEffect, useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  createStyles,
  makeStyles,
  Paper,
  Theme,
} from "@material-ui/core";
import routes from "@/libs/routes";
import { Link, useHistory } from "react-router-dom";
import { Assignment, Home } from "@material-ui/icons";
import { Login, Logout } from "@/components/MaterialSvgIcons";
import { AuthContext } from "@/libs/auth";
import { UserInfo } from "@afes-website/docs";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    selected: {
      color: theme.palette.secondary.main + " !important",
    },
    button: {
      boxSizing: "border-box",
    },
  })
);

const BottomNav: React.FC = () => {
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

  const unListen = history.listen(() => {
    setValue(history.location.pathname);
  });

  useEffect(() => {
    return () => {
      unListen();
    };
  });

  if (auth.get_current_user_id())
    return (
      <Paper elevation={6}>
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          className={classes.root}
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
  else return <React.Fragment />;
};

export default BottomNav;

type MenuItem = [string, string, React.ReactNode];

const menuItems: { [key in keyof UserInfo["permissions"]]?: MenuItem[] } = {
  exhibition: [
    ["入室処理", routes.ExhEnterScan.route.create({}), <Login key="Enter" />],
    ["退室処理", routes.ExhExitScan.route.create({}), <Logout key="Exit" />],
  ],
  general: [
    [
      "入場処理",
      routes.GeneralEnterScan.route.create({}),
      <Login key="Enter" />,
    ],
    [
      "退場処理",
      routes.GeneralExitScan.route.create({}),
      <Logout key="Exit" />,
    ],
  ],
  admin: [["予約", "/admin/reservations", <Assignment key="reservation" />]],
};

const commonMenus: MenuItem[] = [
  ["ホーム", routes.Home.route.create({}), <Home key="Home" />],
];
