import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserInfo } from "@afes-website/docs";
import clsx from "clsx";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Snackbar,
  Theme,
  Toolbar,
  Typography,
  createStyles,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import {
  Close,
  History,
  Home,
  Map,
  NotListedLocation,
  Room,
} from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import AccountIcon from "components/AccountIcon";
import {
  DarkMode,
  LightMode,
  Login,
  Logout,
  QRScannerIcon,
  Reload,
} from "components/MaterialSvgIcons";
import PermissionList from "components/PermissionList";
import { useAuthState } from "hooks/auth/useAuth";
import routes from "libs/routes";
import { useSetThemeMode } from "libs/themeMode";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      overflowY: "scroll",
      padding: theme.spacing(2),
      paddingBottom: 0,
      borderRight: `1px solid ${theme.palette.divider}`,
      transition: "all 0.3s ease",
      position: "relative",
    },
    navClose: {
      transform: "translateX(-100%)",
    },
    cardList: {
      marginBottom: theme.spacing(4),
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
    card: {
      width: "100%",
    },
    currentUserIconWrapper: {
      display: "flex",
      justifyContent: "space-between",
    },
    currentUserIconCurrent: {
      background: "#fff",
      color: theme.palette.primary.main,
    },
    menuIcon: {
      marginBottom: theme.spacing(1),
      fontSize: "40px",
    },
    menuItem: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    menuCurrent: {
      background: `${theme.palette.primary.main} !important`,
      color: theme.palette.primary.contrastText,
    },
    bottomWrapper: {
      marginTop: "auto",
      marginBottom: 0,
      "& hr": {
        marginTop: theme.spacing(0.5),
      },
    },
    actionButton: {
      paddingLeft: theme.spacing(2),
      justifyContent: "left",
      width: "100%",
    },
    snackBar: {
      bottom: theme.spacing(8),
    },
    closeButton: {
      marginLeft: "auto",
    },
  })
);

export interface Props {
  navOpen: boolean;
  setNavOpen: (value: boolean) => void;
  className?: string;
}

const SideNav: React.VFC<Props> = ({ navOpen, setNavOpen, className }) => {
  const classes = useStyles();
  const history = useHistory();
  const { currentUser } = useAuthState();
  const theme = useTheme<Theme>();
  const toggleThemeMode = useSetThemeMode();

  const [snackBarOpen, setSnackBarOpen] = useState(false);

  if (!currentUser) return null;

  const get_menus = () => {
    const menus: MenuItem[] = [];
    menus.push(...commonMenus);
    const _perm: { [name: string]: boolean } = currentUser.permissions;
    Object.entries(menuItems).forEach(([key, items]) => {
      if (items && _perm[key]) menus.push(...items);
    });
    return menus;
  };

  return (
    <Paper
      elevation={0}
      className={clsx(classes.root, className, {
        [classes.navClose]: !navOpen,
      })}
    >
      <div className={classes.cardList}>
        {/* ==== current user ==== */}
        <Box>
          <Card className={classes.card}>
            <CardActionArea
              onClick={() => {
                history.push(routes.Account.route.create({}));
              }}
              className={clsx({
                [classes.menuCurrent]:
                  history.location.pathname === routes.Account.route.create({}),
              })}
            >
              <CardContent>
                <div className={classes.currentUserIconWrapper}>
                  <AccountIcon
                    account={currentUser}
                    className={clsx(classes.menuIcon, {
                      [classes.currentUserIconCurrent]:
                        history.location.pathname ===
                        routes.Account.route.create({}),
                    })}
                  />
                  <PermissionList account={currentUser} />
                </div>
                <Typography variant="h6">{currentUser.name || ""}</Typography>
                <Typography variant="body2">@{currentUser.id || ""}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>

        {/* ==== menus ==== */}
        {get_menus().map(({ label, value }) => (
          <Box key={label}>
            {label && <Typography variant="overline">{label}</Typography>}
            <Card>
              <List disablePadding>
                {value.map(([name, route, icon]) => (
                  <ListItem
                    button
                    key={name}
                    to={route}
                    component={Link}
                    className={clsx(classes.menuItem, {
                      [classes.menuCurrent]:
                        history.location.pathname === route,
                    })}
                    disableRipple
                    disableTouchRipple
                  >
                    <ListItemIcon style={{ color: "inherit" }}>
                      {icon}
                    </ListItemIcon>
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Box>
        ))}
      </div>

      {/* ==== bottom buttons ==== */}
      <div className={classes.bottomWrapper}>
        <Button
          variant="text"
          color={
            history.location.pathname === routes.Terms.route.create({})
              ? "secondary"
              : "inherit"
          }
          component={Link}
          to={routes.Terms.route.create({})}
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
          <IconButton
            onClick={() => {
              setNavOpen(false);
            }}
            className={classes.closeButton}
          >
            <Close />
          </IconButton>
        </Toolbar>
      </div>

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
    </Paper>
  );
};

export default SideNav;

type MenuItem = { label: string; value: [string, string, React.ReactNode][] };

const commonMenus: MenuItem[] = [
  {
    label: "",
    value: [["ホーム", routes.Home.route.create({}), <Home key="Home" />]],
  },
];

const menuItems: { [key in keyof UserInfo["permissions"]]?: MenuItem[] } = {
  exhibition: [
    {
      label: "入退室処理",
      value: [
        [
          "入室スキャン",
          routes.EnterScan.route.create({}),
          <Login key="Enter" />,
        ],
        [
          "退室スキャン",
          routes.ExitScan.route.create({}),
          <Logout key="Exit" />,
        ],
        [
          "スキャン履歴",
          routes.ScanHistory.route.create({}),
          <History key="History" />,
        ],
      ],
    },
  ],
  executive: [
    {
      label: "入退場処理",
      value: [
        [
          "入場スキャン",
          routes.CheckInScan.route.create({}),
          <Login key="Enter" />,
        ],
        [
          "退場スキャン",
          routes.CheckOutScan.route.create({}),
          <Logout key="Exit" />,
        ],
      ],
    },
    {
      label: "滞在状況",
      value: [
        [
          "全展示の滞在状況一覧",
          routes.AllExhStatus.route.create({}),
          <Room key="Status" />,
        ],
        [
          "混雑状況ヒートマップ",
          routes.HeatMap.route.create({}),
          <Map key="HeatMap" />,
        ],
      ],
    },
    {
      label: "情報照会",
      value: [
        [
          "来場者・予約情報照会",
          routes.GuestInfo.route.create({}),
          <QRScannerIcon key="GuestInfo" />,
        ],
        [
          "予備リストバンド登録",
          routes.RegisterSpare.route.create({}),
          <NotListedLocation key="RegisterSpare" />,
        ],
      ],
    },
  ],
};
