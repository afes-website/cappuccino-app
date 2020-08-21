import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  createStyles,
  makeStyles,
  SvgIcon,
  Theme,
} from "@material-ui/core";
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
  })
);

const BottomNav: React.FunctionComponent = () => {
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const menus: [string, React.ReactNode][] = [
    ["Home", <Home key="Home" />],
    [
      "Enter",
      <SvgIcon key="Enter">
        <FontAwesomeIcon icon={faDoorOpen} />
      </SvgIcon>,
    ],
    [
      "Exit",
      <SvgIcon key="Exit">
        <FontAwesomeIcon icon={faDoorClosed} />
      </SvgIcon>,
    ],
    ["History", <History key="History" />],
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
      {menus.map(([label, Component]) => {
        return (
          <BottomNavigationAction
            label={label}
            icon={Component}
            classes={{
              selected: classes.selected,
            }}
            key={label}
          />
        );
      })}
    </BottomNavigation>
  );
};

export default BottomNav;
