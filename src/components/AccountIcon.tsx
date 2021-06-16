import React from "react";
import { StorageUserInfo } from "libs/auth";
import { Person } from "@material-ui/icons";
import {
  PersonSetting,
  PersonSecurity,
  PersonAssignment,
  PersonRoom,
  PersonTeacher,
} from "components/MaterialSvgIcons";
import { SvgIconProps } from "@material-ui/core";

const AccountIcon: React.VFC<
  { account: StorageUserInfo | null } & SvgIconProps
> = (props) => {
  const { account, ...iconProps } = props;
  if (account?.permissions.teacher) return <PersonTeacher {...iconProps} />;
  if (account?.permissions.admin) return <PersonSecurity {...iconProps} />;
  if (account?.permissions.reservation)
    return <PersonAssignment {...iconProps} />;
  if (account?.permissions.general) return <PersonSetting {...iconProps} />;
  if (account?.permissions.exhibition) return <PersonRoom {...iconProps} />;
  return <Person {...iconProps} />;
};

export default AccountIcon;
