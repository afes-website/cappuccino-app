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
  dependency?: unknown;
}

const ToggleVisibilityListItem: React.FC<ToggleVisibilityListItemProps> = ({
  icon,
  primary,
  secondary,
  dependency,
}) => {
  const [visibility, setVisibility] = useState(false);

  useEffect(() => {
    setVisibility(false);
  }, [dependency]);

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
