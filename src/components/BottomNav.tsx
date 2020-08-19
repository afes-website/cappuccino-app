import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import {
  Home,
  AddCircleOutline,
  RemoveCircleOutline,
  History,
} from "@material-ui/icons";

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
    ["Enter", <AddCircleOutline key="Enter" />],
    ["Exit", <RemoveCircleOutline key="Exit" />],
    ["History", <History key="History" />],
  ];

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      className={classes.root}
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
