import React from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ErrorOutline } from "@material-ui/icons";

const useStyles = makeStyles((theme) =>
  createStyles({
    errorIcon: {
      color: theme.palette.error.main,
      width: 26,
      height: 26,
      position: "relative",
      top: 5,
      marginRight: theme.spacing(1),
    },
  })
);

export interface UniversalErrorDialogProps {
  open: boolean;
  title?: string;
  message: string[];
  onClose: () => void;
}

const ErrorDialog: React.FC<UniversalErrorDialogProps> = (props) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>
        <ErrorOutline className={classes.errorIcon} />
        {props.title || "エラーが発生しました"}
      </DialogTitle>
      <DialogContent>
        {props.message.map((message, index) => (
          <DialogContentText key={index}>{message}</DialogContentText>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="secondary">
          閉じる
        </Button>
        <Button
          onClick={() => {
            props.onClose();
            history.goBack();
          }}
          color="secondary"
          autoFocus
        >
          前の画面に戻る
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
