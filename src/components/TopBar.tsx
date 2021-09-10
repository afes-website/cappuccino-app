import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { ArrowBack, ArrowBackIos } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import AccountIcon from "components/AccountIcon";
import AccountDrawer from "components/AccountDrawer";
import { useAuthState } from "libs/auth/useAuth";
import routes from "libs/routes";
import clsx from "clsx";
import chroma from "chroma-js";
import UAParser from "ua-parser-js";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      paddingTop: "env(safe-area-inset-top)",
      color: theme.palette.text.primary,
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
  scrollTop: number;
  className?: string;
}

const TopBar: React.VFC<Props> = ({ title, scrollTop, className }) => {
  const classes = useStyles();
  const history = useHistory();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNeedBackButton, setIsNeedBackButton] = useState(
    history.location.pathname !== "/"
  );
  const { currentUser } = useAuthState();
  const theme = useTheme<Theme>();

  const isApple = useMemo(() => {
    const parser = new UAParser(navigator.userAgent);
    return parser.getDevice().vendor === "Apple";
  }, []);

  const isTablet = useMediaQuery(theme.breakpoints.up("sm"));

  function onDrawerClose(): undefined {
    setIsDrawerOpen(false);
    return undefined;
  }

  useEffect(() => {
    setIsNeedBackButton(history.location.pathname !== "/");
  }, [history.location.pathname]);

  return (
    <div className={clsx(classes.root, className)}>
      <AppBar
        position="static"
        elevation={scrollTop < 100 ? Math.ceil((scrollTop / 100) * 3) : 3}
        className={classes.appBar}
        style={{
          background: chroma
            .mix(
              theme.palette.background.default,
              theme.palette.background.paper,
              scrollTop < 100 ? scrollTop / 100 : 1.0
            )
            .hex(),
        }}
      >
        <Toolbar>
          {(currentUser ||
            routes.Terms.route.create({}) === history.location.pathname ||
            routes.LoginWithQR.route.create({}) ===
              history.location.pathname) &&
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
              !isTablet && (
                <IconButton
                  className={clsx(classes.menuIcon, classes.accountButton)}
                  color="inherit"
                  onClick={() => {
                    setIsDrawerOpen(true);
                  }}
                >
                  <AccountIcon account={currentUser} />
                </IconButton>
              )
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
