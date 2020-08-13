import React from "react";
import PropTypes from "prop-types";
import { Drawer, createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "70vw",
    },
    nowAccount: {
      background: theme.palette.primary.main,
      height: "130px",
    },
  })
);

interface Props {
  isOpen: boolean;
  onDrawerClose: () => undefined;
}

const AccountDrawer: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();

  return (
    <Drawer
      open={props.isOpen}
      onClose={props.onDrawerClose}
      classes={{
        paper: classes.paper,
      }}
    >
      <div className={classes.nowAccount} />
    </Drawer>
  );
};

AccountDrawer.propTypes = {
  isOpen: PropTypes.any,
  onDrawerClose: PropTypes.any,
};

export default AccountDrawer;
