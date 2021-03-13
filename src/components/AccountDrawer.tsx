import React from "react";
import { Link } from "react-router-dom";
import routes from "@/libs/routes";
import {
  Button,
  createStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import { AddCircleOutline, RemoveCircleOutline } from "@material-ui/icons";
import { AuthContext } from "@/libs/auth";
import UserIcon from "@/components/UserIcon";

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
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDrawerClose: () => undefined;
}

const AccountDrawer: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const auth = React.useContext(AuthContext);
  const [isLogoutAlertVisible, setIsLogoutAlertVisible] = React.useState(false);

  return (
    <Drawer
      open={props.isOpen}
      onClose={props.onDrawerClose}
      classes={{
        paper: classes.paper,
      }}
    >
      <Paper className={classes.nowAccount} square={true}>
        <UserIcon
          account={auth.val.get_current_user()}
          className={classes.menuIcon}
          color="inherit"
        />
        <Typography variant="h6">
          {auth.val.get_current_user()?.name || ""}
        </Typography>
        <Typography variant="body2">
          @{auth.val.get_current_user()?.id || ""}
        </Typography>
      </Paper>
      <List>
        {Object.values(auth.val.get_all_users())
          .map((info) => {
            return info;
          })
          .filter((account) => {
            return account.id !== auth.val.get_current_user()?.id;
          })
          .map((account, index, array) => {
            return (
              <React.Fragment key={account.id}>
                <ListItem
                  button
                  onClick={() => {
                    auth.val.switch_user(account.id);
                  }}
                >
                  <ListItemAvatar>
                    <UserIcon
                      account={account}
                      className={classes.listIcon}
                      color="inherit"
                    />
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
        onClick={() => {
          props.setIsOpen(false);
        }}
      >
        アカウントを追加（ログイン）
      </Button>
      <Button
        className={[classes.actionButton, classes.logoutButton].join(" ")}
        startIcon={<RemoveCircleOutline />}
        onClick={() => {
          setIsLogoutAlertVisible(true);
        }}
      >
        @{auth.val.get_current_user_id()} からログアウト
      </Button>
      <Dialog open={isLogoutAlertVisible}>
        <DialogTitle>ログアウトしますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            @{auth.val.get_current_user_id()} からログアウトしますか？
          </DialogContentText>
          <DialogContentText>
            {`ログアウト後、再び @${auth.val.get_current_user_id()} を使用するにはパスワードが必要です。`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsLogoutAlertVisible(false);
            }}
            color="secondary"
          >
            キャンセル
          </Button>
          <Button
            onClick={() => {
              auth.val.remove_user(auth.val.get_current_user_id() || "");
              if (!auth.val.get_current_user_id()) props.setIsOpen(false);
              setIsLogoutAlertVisible(false);
            }}
            color="secondary"
          >
            ログアウト
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default AccountDrawer;
