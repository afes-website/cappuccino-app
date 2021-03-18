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
import AccountIcon from "@/components/AccountIcon";
import AccountDrawer from "@/components/AccountDrawer";
import { AuthContext } from "@/libs/auth";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
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
}

const AppBar: React.FC<Props> = (props) => {
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

  const unListen = history.listen(() => {
    setIsNeedBackButton(history.location.pathname !== "/");
  });
  useEffect(() => {
    return () => {
      unListen();
    };
  });

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {auth.get_current_user_id() &&
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
            {props.title}
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

export default AppBar;
