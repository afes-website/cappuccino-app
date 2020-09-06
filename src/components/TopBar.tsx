import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  SvgIcon,
  createStyles,
  makeStyles,
} from "@material-ui/core";
import { ArrowBackIos } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import AccountDrawer from "@/components/AccountDrawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext, get_user_icon } from "@/libs/auth";

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

const TopBar: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isNeedBackButton, setIsNeedBackButton] = React.useState(
    history.location.pathname !== "/"
  );
  const auth = React.useContext(AuthContext);

  function onDrawerClose(): undefined {
    setIsDrawerOpen(false);
    return undefined;
  }

  const unListen = history.listen(() => {
    setIsNeedBackButton(history.location.pathname !== "/");
  });
  React.useEffect(() => {
    return () => {
      unListen();
    };
  });

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {auth.val.get_current_user_id() &&
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
                <SvgIcon>
                  <FontAwesomeIcon
                    icon={get_user_icon(auth.val.get_current_user())}
                  />
                </SvgIcon>
              </IconButton>
            ))}
          <Typography variant="h6" align="center" className={classes.title}>
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <AccountDrawer isOpen={isDrawerOpen} onDrawerClose={onDrawerClose} />
    </div>
  );
};

export default TopBar;
