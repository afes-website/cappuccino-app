import React from "react";
import { StorageUserInfo } from "@/libs/auth";
import { Person } from "@material-ui/icons";
import { PersonSetting, PersonSecurity } from "@/components/MaterialSvgIcons";
import { SvgIconProps } from "@material-ui/core";

const UserIcon: React.FC<{ account: StorageUserInfo | null } & SvgIconProps> = (
  props
) => {
  const { account, ...iconProps } = props;
  if (account?.permissions.admin) return <PersonSecurity {...iconProps} />;
  if (account?.permissions.general) return <PersonSetting {...iconProps} />;
  if (account?.permissions.exhibition) return <Person {...iconProps} />;
  return <Person {...iconProps} />;
};

export default UserIcon;
