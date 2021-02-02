import React from "react";
import { useTitleSet } from "@/libs/title";

const NotFound: React.FunctionComponent = () => {
  useTitleSet("404 Not Found");

  return <h1>404 Not Found</h1>;
};

export default NotFound;
