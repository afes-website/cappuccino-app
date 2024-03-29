import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { IconButton } from "@material-ui/core";
import { HelpOutline } from "@material-ui/icons";
import HelpManualPopUp from "components/HelpManualPopUp";

const HelpManualButton: React.VFC<{ className?: string }> = ({ className }) => {
  const location = useLocation();

  const [markdown, setMarkdown] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    ((_pathname: string) => {
      setMarkdown(null);
      axios({
        url: (_pathname === "/" ? "" : _pathname) + "/index.md",
        baseURL: process.env.REACT_APP_MANUAL_BASE_URL,
        responseType: "text",
        method: "GET",
      })
        .then((res) => {
          if (_pathname === location.pathname) {
            if (typeof res.data === "string") setMarkdown(res.data);
            else setMarkdown(null);
          }
        })
        .catch(() => {
          if (_pathname === location.pathname) setMarkdown(null);
        });
    })(location.pathname);
  }, [location.pathname]);

  if (!markdown) return null;

  return (
    <>
      <IconButton
        className={className}
        onClick={() => {
          setOpen(true);
        }}
      >
        <HelpOutline />
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
