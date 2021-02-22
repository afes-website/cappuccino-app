import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";

const DirectInputModal: React.FC<{
  open: boolean;
  setOpen: (val: boolean) => void;
  onIdChange: (val: string) => void;
  currentId: string;
  type: "guest" | "rsv";
}> = (props) => {
  const [id, setId] = useState(props.currentId);
  const handleClose = () => {
    props.setOpen(false);
    setId("");
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {props.type === "rsv" ? "予約" : "ゲスト"} ID 直接入力
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          QRコードがない場合や読み取れない場合は、下のフォームに直接入力してください。
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label={`${props.type === "rsv" ? "予約" : "ゲスト"} ID`}
          value={id}
          onChange={(event) => {
            setId(event.target.value);
          }}
          fullWidth
          placeholder={props.type === "rsv" ? "R-00000" : "GX-00000"}
          color="secondary"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          キャンセル
        </Button>
        <Button
          onClick={() => {
            handleClose();
            props.onIdChange(id);
          }}
          color="secondary"
        >
          決定
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DirectInputModal;
