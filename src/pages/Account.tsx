import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Theme,
  Typography,
  createStyles,
  makeStyles,
} from "@material-ui/core";
import { AddCircleOutline, RemoveCircleOutline } from "@material-ui/icons";
import AccountIcon from "components/AccountIcon";
import PermissionList from "components/PermissionList";
import { useAuthDispatch, useAuthState } from "hooks/auth/useAuth";
import routes from "libs/routes";
import { useTitleSet } from "libs/title";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: theme.spacing(2),
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
    currentUser: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: theme.spacing(2),
    },
    currentUserIcon: {
      fontSize: 64,
      marginBottom: theme.spacing(1),
    },
    currentUserPerm: {
      marginTop: theme.spacing(2),
    },
    grid: {
      width: "100%",
    },
    listIcon: {
      fontSize: 32,
    },
    logoutButton: {
      color: theme.palette.error.main,
    },
    actionButton: {
      paddingLeft: theme.spacing(2),
      justifyContent: "left",
      width: "100%",
    },
  })
);

const Account: React.VFC = () => {
  useTitleSet("アカウント");
  const classes = useStyles();
  const { allUsers, currentUser, currentUserId } = useAuthState();
  const { switchCurrentUser, removeUser } = useAuthDispatch();

  const [isLogoutAlertVisible, setIsLogoutAlertVisible] = useState(false);

  return (
    <Grid container spacing={2} className={classes.root}>
      {/* ==== current user ==== */}
      <Grid item xs={12} className={classes.currentUser}>
        <AccountIcon
          account={currentUser}
          className={classes.currentUserIcon}
        />
        <Typography variant="h6">{currentUser?.name ?? ""}</Typography>
        <Typography variant="body2" color="textSecondary">
          @{currentUser?.id ?? ""}
        </Typography>
        <PermissionList
          account={currentUser}
          className={classes.currentUserPerm}
        />
      </Grid>

      {/* ==== account list ==== */}
      {Object.values(allUsers).length > 1 && (
        <Grid item xs={12} sm={10} md={8} className={classes.grid}>
          <Typography variant="overline">アカウント切り替え</Typography>
          <Card>
            <List disablePadding>
              {Object.values(allUsers)
                .filter((account) => account.id !== currentUser?.id)
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
                        <AccountIcon
                          account={account}
                          className={classes.listIcon}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={account.name}
                        secondary={"@" + account.id}
                      />
                    </ListItem>
                  );
                })}
            </List>
          </Card>
        </Grid>
      )}

      {/* ==== login / logout ==== */}
      <Grid item xs={12} sm={10} md={8} className={classes.grid}>
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
            setIsLogoutAlertVisible(true);
          }}
        >
          @{currentUserId} からログアウト
        </Button>
      </Grid>

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
              removeUser(currentUserId || "");
              setIsLogoutAlertVisible(false);
            }}
            color="secondary"
          >
            ログアウト
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Account;
