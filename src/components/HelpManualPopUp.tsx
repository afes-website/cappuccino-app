import React from "react";
import "zenn-content-css";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Theme,
  createStyles,
  makeStyles,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import markdownToHtml from "libs/markdown";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  })
);

export interface Props {
  markdown: string;
  open: boolean;
  onClose: () => void;
}

const HelpModalPopUp: React.VFC<Props> = ({ markdown, open, onClose }) => {
  const classes = useStyles();

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      scroll="paper"
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        アプリの使い方
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        className="znc"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }}
      />
    </Dialog>
  );
};

export default HelpModalPopUp;
