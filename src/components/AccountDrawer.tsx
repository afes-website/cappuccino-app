import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import routes from "libs/routes";
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
  useTheme,
  IconButton,
  Toolbar,
  Snackbar,
} from "@material-ui/core";
import { AddCircleOutline, RemoveCircleOutline } from "@material-ui/icons";
import { AuthContext } from "libs/auth";
import AccountIcon from "components/AccountIcon";
import { useSetThemeMode } from "libs/themeMode";
import { DarkMode, LightMode, Reload } from "components/MaterialSvgIcons";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "70vw",
    },
    nowAccount: {
      color: theme.palette.primary.contrastText,
      background: theme.palette.primary.main,
      padding: theme.spacing(2),
      paddingTop: `calc(${theme.spacing(2)}px + env(safe-area-inset-top))`,
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
    bottomWrapper: {
      marginTop: "auto",
      marginBottom: "env(safe-area-inset-bottom)",
    },
    snackBar: {
      bottom: theme.spacing(8),
    },
  })
);

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDrawerClose: () => undefined;
}

const AccountDrawer: React.FC<Props> = (props) => {
  const classes = useStyles();
  const auth = useContext(AuthContext).val;
  const theme = useTheme<Theme>();
  const toggleThemeMode = useSetThemeMode();

  const [isLogoutAlertVisible, setIsLogoutAlertVisible] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  return (
    <Drawer
      open={props.isOpen}
      onClose={props.onDrawerClose}
      classes={{
        paper: classes.paper,
      }}
    >
      {/* ==== current list ==== */}
      <Paper className={classes.nowAccount} square={true}>
        <AccountIcon
          account={auth.get_current_user()}
          className={classes.menuIcon}
          color="inherit"
        />
        <Typography variant="h6">
          {auth.get_current_user()?.name || ""}
        </Typography>
        <Typography variant="body2">
          @{auth.get_current_user()?.id || ""}
        </Typography>
      </Paper>

      {/* ==== account list ==== */}
      <List>
        {Object.values(auth.get_all_users())
          .filter((account) => account.id !== auth.get_current_user()?.id)
          .map((account, index, array) => {
            return (
              <React.Fragment key={account.id}>
                <ListItem
                  button
                  onClick={() => {
                    auth.switch_user(account.id);
                  }}
                >
                  <ListItemAvatar>
                    <AccountIcon
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
                {index !== array.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            );
          })}
      </List>

      {/* ==== login / logout ==== */}
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
        @{auth.get_current_user_id()} からログアウト
      </Button>

      {/* ==== bottom buttons ==== */}
      <div className={classes.bottomWrapper}>
        <Divider />
        <Toolbar>
          <IconButton onClick={toggleThemeMode}>
            {theme.palette.type === "light" ? <DarkMode /> : <LightMode />}
          </IconButton>
          <IconButton
            onClick={() => {
              navigator.serviceWorker.getRegistration().then((reg) => {
                if (reg)
                  reg.update().then(() => {
                    setTimeout(() => {
                      setSnackBarOpen(true);
                    }, 500);
                  });
              });
            }}
          >
            <Reload />
          </IconButton>
        </Toolbar>
      </div>

      {/* ==== dialogs ==== */}
      <Dialog open={isLogoutAlertVisible}>
        <DialogTitle>ログアウトしますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            @{auth.get_current_user_id()} からログアウトしますか？
          </DialogContentText>
          <DialogContentText>
            {`ログアウト後、再び @${auth.get_current_user_id()} を使用するにはパスワードが必要です。`}
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
              auth.remove_user(auth.get_current_user_id() || "");
              if (!auth.get_current_user_id()) props.setIsOpen(false);
              setIsLogoutAlertVisible(false);
            }}
            color="secondary"
          >
            ログアウト
          </Button>
        </DialogActions>
      </Dialog>

      {/* ==== already up to date snack bar ==== */}
      <Snackbar
        open={snackBarOpen}
        onClose={() => {
          setSnackBarOpen(false);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        autoHideDuration={3000}
        className={classes.snackBar}
      >
        <Alert
          severity="success"
          variant="filled"
          elevation={6}
          onClose={() => {
            setSnackBarOpen(false);
          }}
        >
          すでに最新版です！
        </Alert>
      </Snackbar>
    </Drawer>
  );
};

export default AccountDrawer;
