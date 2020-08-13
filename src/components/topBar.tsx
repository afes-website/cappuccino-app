import React from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { ArrowBackIos, AccountCircle } from "@material-ui/icons";
import AccountDrawer from "@/components/accountDrawer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
      position: "absolute",
    },
    title: {
      flexGrow: 1,
    },
  })
);

interface Props {
  title: string;
  isNeedBackButton: boolean;
}

const TopBar: React.FunctionComponent<Props> = (props) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const classes = useStyles();

  function onDrawerClose(): undefined {
    setIsDrawerOpen(false);
    return undefined;
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {props.isNeedBackButton ? (
            <div>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
              >
                <ArrowBackIos />
              </IconButton>
            </div>
          ) : (
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              onClick={() => {
                setIsDrawerOpen(true);
              }}
            >
              <AccountCircle />
            </IconButton>
          )}
          <Typography variant="h6" align="center" className={classes.title}>
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <AccountDrawer isOpen={isDrawerOpen} onDrawerClose={onDrawerClose} />
    </div>
  );
};

TopBar.propTypes = {
  title: PropTypes.any,
  isNeedBackButton: PropTypes.any,
};

export default TopBar;
