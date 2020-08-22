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
import { Link } from "react-router-dom";
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
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const menus: [string, string, React.ReactNode][] = [
    ["Home", routes.Home.route.create({}), <Home key="Home" />],
    [
      "Enter",
      routes.Scan.route.create({}),
      <SvgIcon key="Enter">
        <FontAwesomeIcon icon={faDoorOpen} />
      </SvgIcon>,
    ],
    [
      "Exit",
      routes.Scan.route.create({}),
      <SvgIcon key="Exit">
        <FontAwesomeIcon icon={faDoorClosed} />
      </SvgIcon>,
    ],
    ["History", routes.Scan.route.create({}), <History key="History" />],
  ];

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
          />
        );
      })}
    </BottomNavigation>
  );
};

export default BottomNav;
