import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import { Help } from "@material-ui/icons";
import axios from "axios";

const HelpManualButton: React.VFC<{ className?: string }> = ({ className }) => {
  const history = useHistory();

  const [markdown, setMarkdown] = useState<string | null>(null);

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
    <IconButton className={className}>
      <Help />
    </IconButton>
  );
};

export default HelpManualButton;
