import React from "react";
import { Edit } from "@material-ui/icons";
import RightBottomFab from "components/RightBottomFab";

const DirectInputFab: React.FC<{
  onClick: () => void;
  disabled?: boolean;
}> = (props) => {
  return (
    <RightBottomFab
      onClick={props.onClick}
      icon={<Edit />}
      label="直接入力"
      disabled={props.disabled}
    />
  );
};

export default DirectInputFab;
