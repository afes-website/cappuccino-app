import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  createStyles,
  makeStyles,
} from "@material-ui/core";
import { ArrowBack, ArrowBackIos } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import AccountIcon from "components/AccountIcon";
import AccountDrawer from "components/AccountDrawer";
import { AuthContext } from "libs/auth";
import routes from "libs/routes";
import clsx from "clsx";
import UAParser from "ua-parser-js";

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
      height: 48,
      width: 48,
      top: 4,
      left: 10,
    },
    accountButton: {
      padding: 6.5,
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

  const isApple = useMemo(() => {
    const parser = new UAParser(navigator.userAgent);
    return parser.getDevice().vendor === "Apple";
  }, []);

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
                className={classes.menuIcon}
                color="inherit"
                onClick={() => {
                  history.goBack();
                }}
              >
                {isApple ? <ArrowBackIos /> : <ArrowBack />}
              </IconButton>
            ) : (
              <IconButton
                className={clsx(classes.menuIcon, classes.accountButton)}
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
