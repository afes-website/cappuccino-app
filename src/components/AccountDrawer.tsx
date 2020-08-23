import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  createStyles,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Paper,
  SvgIcon,
  Theme,
  Typography,
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserCog,
  faUserShield,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { AddCircleOutline, RemoveCircleOutline } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "70vw",
    },
    nowAccount: {
      color: theme.palette.primary.contrastText,
      background: theme.palette.primary.main,
      padding: theme.spacing(2),
    },
    menuIcon: {
      marginBottom: theme.spacing(1),
      fontSize: "40px",
    },
    listIcon: {
      fontSize: "40px",
    },
    actionButton: {
      paddingLeft: theme.spacing(2),
      justifyContent: "left",
    },
    logoutButton: {
      color: theme.palette.error.main,
    },
  })
);

interface Props {
  isOpen: boolean;
  onDrawerClose: () => undefined;
}

const AccountDrawer: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const currentAccount = "agc";
  const accounts: { id: string; name: string; icon: IconDefinition }[] = [
    {
      id: "agc",
      name: "AZABU GAME CENTER",
      icon: faUser,
    },
    {
      id: "admin",
      name: "総務局ウェブサイト班",
      icon: faUserShield,
    },
    {
      id: "unnei-reception",
      name: "運営局 入退場口",
      icon: faUserCog,
    },
    {
      id: "obake",
      name: "お化け屋敷展 屍臭漂う麻布病",
      icon: faUser,
    },
  ];
  const currentAccountInfo = accounts.find((account) => {
    return account.id === currentAccount;
  });

  return (
    <Drawer
      open={props.isOpen}
      onClose={props.onDrawerClose}
      classes={{
        paper: classes.paper,
      }}
    >
      <Paper className={classes.nowAccount} square={true}>
        <SvgIcon className={classes.menuIcon} color="inherit">
          <FontAwesomeIcon icon={currentAccountInfo?.icon || faUser} />
        </SvgIcon>
        <Typography variant="h6">{currentAccountInfo?.name || ""}</Typography>
        <Typography variant="body2">@{currentAccountInfo?.id || ""}</Typography>
      </Paper>
      <List>
        {accounts
          .filter((account) => {
            return account.id !== currentAccount;
          })
          .map((account, index, array) => {
            return (
              <React.Fragment key={account.id}>
                <ListItem button>
                  <ListItemAvatar>
                    <SvgIcon className={classes.listIcon} color="inherit">
                      <FontAwesomeIcon icon={account.icon} />
                    </SvgIcon>
                  </ListItemAvatar>
                  <ListItemText
                    primary={account.name}
                    secondary={"@" + account.id}
                  />
                </ListItem>
                {index !== array.length - 1 ? (
                  <Divider variant="inset" component="li" />
                ) : (
                  <React.Fragment />
                )}
              </React.Fragment>
            );
          })}
      </List>
      <Button
        className={classes.actionButton}
        color="secondary"
        startIcon={<AddCircleOutline />}
      >
        アカウントを追加（ログイン）
      </Button>
      <Button
        className={[classes.actionButton, classes.logoutButton].join(" ")}
        startIcon={<RemoveCircleOutline />}
      >
        @agc からログアウト
      </Button>
    </Drawer>
  );
};

AccountDrawer.propTypes = {
  isOpen: PropTypes.any,
  onDrawerClose: PropTypes.any,
};

export default AccountDrawer;
