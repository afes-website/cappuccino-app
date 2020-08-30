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
import { Home, History } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faDoorClosed } from "@fortawesome/free-solid-svg-icons";

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
  const menus: [string, string, React.ReactNode][] = [
    ["Home", routes.Home.route.create({}), <Home key="Home" />],
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
      routes.ExhEnterScan.route.create({}),
      <History key="History" />,
    ],
  ];

  const unListen = history.listen(() => {
    setValue(history.location.pathname);
  });

  React.useEffect(() => {
    return () => {
      unListen();
    };
  });

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      className={classes.root}
      showLabels={true}
    >
      {menus.map(([label, route, Component]) => {
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
};

export default BottomNav;
