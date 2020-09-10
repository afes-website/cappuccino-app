import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  createStyles,
  makeStyles,
  SvgIcon,
  Theme,
} from "@material-ui/core";
import routes from "@/libs/routes";
import { Link, useHistory } from "react-router-dom";
import { Assignment, Home, History } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faDoorClosed } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "@/libs/auth";
import { UserInfo } from "@afes-website/docs";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderTop: "1px solid " + theme.palette.secondary.main,
    },
    selected: {
      color: theme.palette.secondary.main + " !important",
    },
    button: {
      boxSizing: "border-box",
    },
  })
);

const BottomNav: React.FunctionComponent = () => {
  const history = useHistory();
  const classes = useStyles();
  const [value, setValue] = React.useState(history.location.pathname);
  const auth = React.useContext(AuthContext);

  const get_menus = () => {
    const menus: MenuItem[] = [];
    menus.push(...commonMenus);
    const _perm:
      | { [name: string]: boolean }
      | undefined = auth.val.get_current_user()?.permissions;
    if (!_perm) return menus;
    Object.entries(menuItems).forEach(([key, items]) => {
      if (items && _perm[key]) menus.push(...items);
    });
    return menus;
  };

  const unListen = history.listen(() => {
    setValue(history.location.pathname);
  });

  React.useEffect(() => {
    return () => {
      unListen();
    };
  });

  if (auth.val.get_current_user_id())
    return (
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
    );
  else return <React.Fragment />;
};

export default BottomNav;

type MenuItem = [string, string, React.ReactNode];

const menuItems: { [key in keyof UserInfo["permissions"]]?: MenuItem[] } = {
  exhibition: [
    [
      "Enter",
      routes.ExhEnterScan.route.create({}),
      <SvgIcon key="Enter">
        <FontAwesomeIcon icon={faDoorOpen} />
      </SvgIcon>,
    ],
    [
      "Exit",
      routes.ExhExitScan.route.create({}),
      <SvgIcon key="Exit">
        <FontAwesomeIcon icon={faDoorClosed} />
      </SvgIcon>,
    ],
    [
      "History",
      routes.ExhScanHistory.route.create({}),
      <History key="History" />,
    ],
  ],
  general: [["History", "/general/history", <History key="History" />]],
  admin: [
    ["Reservation", "/admin/reservations", <Assignment key="reservation" />],
  ],
};

const commonMenus: MenuItem[] = [
  ["Home", routes.Home.route.create({}), <Home key="Home" />],
];
