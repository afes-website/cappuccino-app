import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import PermissionIcon from "components/PermissionIcon";
import { StorageUserInfo } from "hooks/auth/@types";
import clsx from "clsx";

const useStyles = makeStyles((theme) =>
  createStyles({
    permissionsList: {
      display: "flex",
      height: "min-content",
      "& > * + *": {
        marginLeft: theme.spacing(0.5),
      },
    },
    disabledIcon: {
      opacity: theme.palette.action.disabledOpacity,
    },
  })
);

const PermissionList: React.VFC<{
  account: StorageUserInfo | null;
  className?: string;
}> = ({ account, className }) => {
  const classes = useStyles();

  if (!account) return null;
  return (
    <div className={clsx(classes.permissionsList, className)}>
      {Object.entries(account.permissions).map(([name, val]) => (
        <PermissionIcon
          permName={name}
          key={name}
          fontSize="small"
          className={clsx({ [classes.disabledIcon]: !val })}
        />
      ))}
    </div>
  );
};

export default PermissionList;
