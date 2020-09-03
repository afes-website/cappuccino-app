import React from "react";
import { Link } from "react-router-dom";
import routes from "@/libs/routes";
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
  // faUserCog,
  // faUserShield,
  // IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { AddCircleOutline, RemoveCircleOutline } from "@material-ui/icons";
import {
  get_current_user,
  get_users,
  logout,
  StorageUserInfo,
  switch_user,
} from "@/libs/auth";

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
  const [accounts, setAccounts] = React.useState<StorageUserInfo[]>([]);
  const [currentAccount, setCurrentAccount] = React.useState("");
  // TODO: hook が実装されたらさようなら

  React.useEffect(() => {
    setAccounts(
      Object.values(get_users()).map((info) => {
        return info;
      })
    );
  }, [currentAccount]);

  // TODO: 外部変更を検知できないので、hook が必要です＞＜

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
          <FontAwesomeIcon icon={/*get_current_user()?.icon || */ faUser} />
        </SvgIcon>
        <Typography variant="h6">{get_current_user()?.name || ""}</Typography>
        <Typography variant="body2">@{get_current_user()?.id || ""}</Typography>
      </Paper>
      <List>
        {accounts
          .filter((account) => {
            return account.id !== get_current_user()?.id;
          })
          .map((account, index, array) => {
            return (
              <React.Fragment key={account.id}>
                <ListItem
                  button
                  onClick={() => {
                    switch_user(account.id);
                    setCurrentAccount(get_current_user()?.id || "");
                  }}
                >
                  <ListItemAvatar>
                    <SvgIcon className={classes.listIcon} color="inherit">
                      <FontAwesomeIcon icon={faUser} />
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
        component={Link}
        to={routes.Login.route.create({})}
      >
        アカウントを追加（ログイン）
      </Button>
      <Button
        className={[classes.actionButton, classes.logoutButton].join(" ")}
        startIcon={<RemoveCircleOutline />}
        onClick={() => {
          logout(get_current_user()?.id || "");
          setCurrentAccount(get_current_user()?.id || "");
        }}
      >
        @{get_current_user()?.id} からログアウト
      </Button>
    </Drawer>
  );
};

export default AccountDrawer;
