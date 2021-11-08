import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  createStyles,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    dialogContainer: {
      alignItems: "flex-start",
    },
    dialogPaper: {
      marginTop: theme.spacing(11),
    },
  })
);

const DirectInputModal: React.VFC<{
  open: boolean;
  setOpen: (val: boolean) => void;
  onIdChange: (val: string) => void;
  currentId: string;
  type: "guest" | "rsv";
}> = (props) => {
  const classes = useStyles();

  const [id, setId] = useState("");
  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      classes={{
        paper: classes.dialogPaper,
        container: classes.dialogContainer,
      }}
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
          defaultValue={props.currentId}
          onChange={(event) => {
            setId(event.target.value);
          }}
          fullWidth
          placeholder={props.type === "rsv" ? "R-00000-00000" : "GX-00000"}
          color="secondary"
          inputProps={{
            autocapitalize: "off",
          }}
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
