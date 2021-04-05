import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  createStyles,
  makeStyles,
} from "@material-ui/core";
import { ArrowBackIos } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import AccountIcon from "components/AccountIcon";
import AccountDrawer from "components/AccountDrawer";
import { AuthContext } from "libs/auth";
import clsx from "clsx";
import routes from "../libs/routes";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      paddingTop: "env(safe-area-inset-top)",
    },
    menuIcon: {
      position: "absolute",
    },
    title: {
      flexGrow: 1,
    },
  })
);

interface Props {
  title: string;
  className?: string;
}

const TopBar: React.FC<Props> = ({ title, className }) => {
  const classes = useStyles();
  const history = useHistory();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNeedBackButton, setIsNeedBackButton] = useState(
    history.location.pathname !== "/"
  );
  const auth = useContext(AuthContext).val;

  function onDrawerClose(): undefined {
    setIsDrawerOpen(false);
    return undefined;
  }

  useEffect(() => {
    setIsNeedBackButton(history.location.pathname !== "/");
  }, [history.location.pathname]);

  return (
    <div className={clsx(classes.root, className)}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          {(auth.get_current_user_id() ||
            routes.Terms.route.create({}) === history.location.pathname) &&
            (isNeedBackButton ? (
              <IconButton
                edge="start"
                className={classes.menuIcon}
                color="inherit"
                onClick={() => {
                  history.goBack();
                }}
              >
                <ArrowBackIos />
              </IconButton>
            ) : (
              <IconButton
                edge="start"
                className={classes.menuIcon}
                color="inherit"
                onClick={() => {
                  setIsDrawerOpen(true);
                }}
              >
                <AccountIcon
                  account={auth.get_current_user()}
                  fontSize="large"
                />
              </IconButton>
            ))}
          <Typography variant="h6" align="center" className={classes.title}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <AccountDrawer
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        onDrawerClose={onDrawerClose}
      />
    </div>
  );
};

export default TopBar;
