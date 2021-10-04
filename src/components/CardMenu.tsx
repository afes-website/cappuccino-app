import React from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { NavigateNext } from "@material-ui/icons";

const useStyles = makeStyles(() =>
  createStyles({
    nextIconWrapper: {
      marginRight: -12,
      padding: 12,
      width: 24,
      height: 24,
    },
  })
);

interface MenuItem {
  primary: string;
  secondary?: string;
  to: string;
  icon: React.ReactNode;
}

export interface Props {
  items: MenuItem[];
}

const CardMenu: React.VFC<Props> = ({ items }) => {
  const classes = useStyles();

  return (
    <List component="nav" dense={true}>
      {items.map(({ primary, secondary, to, icon }, index) => (
        <ListItem button component={Link} to={to} key={index}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={primary} secondary={secondary} />
          <div className={classes.nextIconWrapper}>
            <NavigateNext />
          </div>
        </ListItem>
      ))}
    </List>
  );
};

export default CardMenu;
