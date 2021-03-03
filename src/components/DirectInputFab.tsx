import React from "react";
import { Edit } from "@material-ui/icons";
import RightBottomFab from "@/components/RightBottomFab";

const DirectInputFab: React.FC<{
  onClick: () => void;
}> = (props) => {
  return (
    <RightBottomFab onClick={props.onClick} icon={<Edit />} label="直接入力" />
  );
};

export default DirectInputFab;
