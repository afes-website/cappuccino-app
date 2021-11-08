import React from "react";
import { SvgIconProps } from "@material-ui/core";
import { Assignment, Room, Security, Settings } from "@material-ui/icons";

const PermissionIcon: React.VFC<{ permName: string } & SvgIconProps> = ({
  permName,
  ...iconProps
}) => {
  switch (permName) {
    case "admin":
      return <Security {...iconProps} />;
    case "reservation":
      return <Assignment {...iconProps} />;
    case "executive":
      return <Settings {...iconProps} />;
    case "exhibition":
      return <Room {...iconProps} />;
    default:
      return null;
  }
};

export default PermissionIcon;
