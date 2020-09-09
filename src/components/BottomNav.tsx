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

type menuItem = [string, string, React.ReactNode];

const BottomNav: React.FunctionComponent = () => {
  const history = useHistory();
  const classes = useStyles();
  const [value, setValue] = React.useState(history.location.pathname);
  const auth = React.useContext(AuthContext);

  const commonMenus: menuItem[] = [
    ["Home", routes.Home.route.create({}), <Home key="Home" />],
  ];
  const exhMenus: menuItem[] = [
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
  ];
  const generalMenus: menuItem[] = [
    [
      "Enter",
      "/general/enter",
      <SvgIcon key="Enter">
        <FontAwesomeIcon icon={faDoorOpen} />
      </SvgIcon>,
    ],
    [
      "Exit",
      "/general/exit",
      <SvgIcon key="Exit">
        <FontAwesomeIcon icon={faDoorClosed} />
      </SvgIcon>,
    ],
    ["History", "/general/history", <History key="History" />],
  ];
  const adminMenus: menuItem[] = [
    ["Reservation", "/admin/reservations", <Assignment key="reservation" />],
  ];

  const get_menus = () => {
    const menus: menuItem[] = [];
    menus.push(...commonMenus);
    if (auth.val.get_current_user()?.permissions.exhibition)
      menus.push(...exhMenus);
    if (auth.val.get_current_user()?.permissions.general)
      menus.push(...generalMenus);
    if (auth.val.get_current_user()?.permissions.admin)
      menus.push(...adminMenus);
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
