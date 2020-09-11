import React from "react";
import TitleContext from "@/libs/title";

const NotFound: React.FunctionComponent = () => {
  const title = React.useContext(TitleContext);

  React.useEffect(() => {
    title.set("404 Not Found");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <h1>404 Not Found</h1>;
};

export default NotFound;
