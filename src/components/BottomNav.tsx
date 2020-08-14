import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  createStyles,
  makeStyles,
  SvgIconTypeMap,
  Theme,
} from "@material-ui/core";
import {
  Home,
  AddCircleOutline,
  RemoveCircleOutline,
  History,
} from "@material-ui/icons";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";

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
  const menus: [string, OverridableComponent<SvgIconTypeMap>][] = [
    ["Home", Home],
    ["Enter", AddCircleOutline],
    ["Exit", RemoveCircleOutline],
    ["History", History],
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
            icon={<Component />}
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
