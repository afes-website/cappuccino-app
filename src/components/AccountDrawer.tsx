import React, { useEffect, useState } from "react";
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
  Theme,
  Typography,
  useTheme,
  IconButton,
  Toolbar,
  Snackbar,
} from "@material-ui/core";
import { AddCircleOutline, RemoveCircleOutline } from "@material-ui/icons";
import { DarkMode, LightMode, Reload } from "components/MaterialSvgIcons";
import AccountIcon from "components/AccountIcon";
import PermissionList from "components/PermissionList";
import { useAuthDispatch, useAuthState } from "libs/auth/useAuth";
import { useSetThemeMode } from "libs/themeMode";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "70vw",
    },
    currentUserIconWrapper: {
      display: "flex",
      justifyContent: "space-between",
    },
    currentUser: {
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
    actionButtonUpperDivider: {
      marginBottom: theme.spacing(1),
    },
    actionButton: {
      paddingLeft: theme.spacing(2),
      justifyContent: "left",
      width: "100%",
    },
    logoutButton: {
      color: theme.palette.error.main,
    },
    bottomWrapper: {
      marginTop: "auto",
      marginBottom: "env(safe-area-inset-bottom)",
      "& hr": {
        marginTop: theme.spacing(0.5),
      },
    },
    snackBar: {
      bottom: "calc(64px + env(safe-area-inset-bottom))",
    },
  })
);

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDrawerClose: () => undefined;
}

const AccountDrawer: React.VFC<Props> = ({
  isOpen,
  onDrawerClose,
  setIsOpen,
}) => {
  const classes = useStyles();
  const { allUsers, currentUser, currentUserId } = useAuthState();
  const { removeUser, switchCurrentUser } = useAuthDispatch();
  const theme = useTheme<Theme>();
  const toggleThemeMode = useSetThemeMode();

  const [isLogoutAlertVisible, setIsLogoutAlertVisible] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  useEffect(() => {
    if (!currentUserId) setIsOpen(false);
  }, [currentUserId, setIsOpen]);

  return (
    <Drawer
      open={isOpen}
      onClose={onDrawerClose}
      classes={{
        paper: classes.paper,
      }}
    >
      {/* ==== current list ==== */}
      {currentUser && (
        <div className={classes.currentUser}>
          <div className={classes.currentUserIconWrapper}>
            <AccountIcon account={currentUser} className={classes.menuIcon} />
            <PermissionList account={currentUser} />
          </div>
          <Typography variant="h6">{currentUser.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            @{currentUser.id}
          </Typography>
        </div>
      )}

      {/* ==== account list ==== */}
      <List>
        {Object.values(allUsers)
          .filter((account) => account.id !== currentUserId)
          .map((account) => {
            return (
              <ListItem
                button
                onClick={() => {
                  switchCurrentUser(account.id);
                }}
                key={account.id}
              >
                <ListItemAvatar>
                  <AccountIcon account={account} className={classes.listIcon} />
                </ListItemAvatar>
                <ListItemText
                  primary={account.name}
                  secondary={"@" + account.id}
                />
              </ListItem>
            );
          })}
      </List>

      <Divider className={classes.actionButtonUpperDivider} />

      {/* ==== login / logout ==== */}
      <Button
        className={classes.actionButton}
        color="secondary"
        startIcon={<AddCircleOutline />}
        component={Link}
        to={routes.Login.route.create({})}
        onClick={() => {
          setIsOpen(false);
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
        @{currentUserId} からログアウト
      </Button>

      {/* ==== bottom buttons ==== */}
      <div className={classes.bottomWrapper}>
        <Button
          variant="text"
          color="inherit"
          component={Link}
          to={routes.Terms.route.create({})}
          onClick={() => {
            setIsOpen(false);
          }}
          className={classes.actionButton}
        >
          利用規約 & プライバシーポリシー
        </Button>
        <Button
          variant="text"
          color="inherit"
          component="span"
          className={classes.actionButton}
          disabled
        >
          {`Version ${process.env.REACT_APP_VERSION}-${process.env.REACT_APP_BUILD_NUMBER}`}
        </Button>
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
            @{currentUserId} からログアウトしますか？
          </DialogContentText>
          <DialogContentText>
            {`ログアウト後、再び @${currentUserId} を使用するにはパスワードが必要です。`}
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
              setIsLogoutAlertVisible(false);
              if (currentUserId) removeUser(currentUserId);
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
