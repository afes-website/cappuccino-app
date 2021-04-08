import React, { useState, useEffect } from "react";
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  SvgIcon,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

export interface ToggleVisibilityListItemProps {
  icon?: React.ReactElement<typeof SvgIcon>;
  primary: string;
  secondary: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps?: ReadonlyArray<any>;
}

const ToggleVisibilityListItem: React.FC<ToggleVisibilityListItemProps> = ({
  icon,
  primary,
  secondary,
  deps,
}) => {
  const [visibility, setVisibility] = useState(false);

  useEffect(() => {
    setVisibility(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps || []);

  return (
    <ListItem>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText
        primary={visibility ? primary : "••••••••••••••••"}
        secondary={secondary}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          onClick={() => {
            setVisibility(!visibility);
          }}
        >
          {visibility ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default ToggleVisibilityListItem;
