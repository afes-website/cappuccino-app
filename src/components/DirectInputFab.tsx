import React from "react";
import RightBottomFab from "@/components/RightBottomFab";
import { Edit } from "@material-ui/icons";

const DirectInputFab: React.FC<{
  onClick: () => void;
}> = (props) => {
  return (
    <RightBottomFab onClick={props.onClick} icon={<Edit />} label="直接入力" />
  );
};

export default DirectInputFab;
