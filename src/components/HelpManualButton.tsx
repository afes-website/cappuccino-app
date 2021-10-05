import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import { Help } from "@material-ui/icons";
import axios from "axios";
import HelpManualPopUp from "components/HelpManualPopUp";

const HelpManualButton: React.VFC<{ className?: string }> = ({ className }) => {
  const history = useHistory();

  const [markdown, setMarkdown] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios({
      url:
        (history.location.pathname === "/" ? "" : history.location.pathname) +
        "/index.md",
      baseURL: process.env.REACT_APP_MANUAL_BASE_URL,
      responseType: "text",
      method: "GET",
    })
      .then((res) => {
        console.log(res);
        if (typeof res.data === "string") setMarkdown(res.data);
        else setMarkdown(null);
      })
      .catch(() => {
        setMarkdown(null);
      });
  }, [history.location.pathname]);

  if (!markdown) return null;

  return (
    <>
      <IconButton
        className={className}
        onClick={() => {
          setOpen(true);
        }}
      >
        <Help />
      </IconButton>
      <HelpManualPopUp
        markdown={markdown}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

export default HelpManualButton;
