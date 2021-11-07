import React from "react";
import { Avatar, SvgIconProps } from "@material-ui/core";
import { Person } from "@material-ui/icons";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
  PersonSetting,
  PersonSecurity,
  PersonAssignment,
  PersonRoom,
  PersonTeacher,
} from "components/MaterialSvgIcons";
import { StorageUserInfo } from "hooks/auth/@types";
import useExhibitionImageUrl from "hooks/useExhibitionImageUrl";
import clsx from "clsx";

const useStyles = makeStyles((theme) =>
  createStyles({
    avatar: {
      background: "none",
      color: theme.palette.text.primary,
    },
    innerIcon: {
      height: "60%",
      width: "60%",
    },
  })
);

const AccountIcon: React.VFC<{
  account: StorageUserInfo | null;
  className?: string;
}> = ({ account, className }) => {
  const classes = useStyles();
  const exhImage = useExhibitionImageUrl(account?.id ?? "");

  return (
    <Avatar
      className={clsx(classes.avatar, className)}
      src={exhImage ?? ""}
      alt={account?.name}
      color="primary"
    >
      <PersonIcon
        account={account}
        color="inherit"
        className={classes.innerIcon}
      />
    </Avatar>
  );
};

const PersonIcon: React.VFC<
  { account: StorageUserInfo | null } & SvgIconProps
> = ({ account, ...svgIconProps }) => {
  if (account?.permissions.teacher) return <PersonTeacher {...svgIconProps} />;
  if (account?.permissions.admin) return <PersonSecurity {...svgIconProps} />;
  if (account?.permissions.reservation)
    return <PersonAssignment {...svgIconProps} />;
  if (account?.permissions.executive)
    return <PersonSetting {...svgIconProps} />;
  if (account?.permissions.exhibition) return <PersonRoom {...svgIconProps} />;
  return <Person {...svgIconProps} />;
};

export default AccountIcon;
