import React, { useState } from "react";
import TypesafeRouter from "@/components/typesafeRouter";
import routes from "@/libs/routes";
import { createBrowserHistory } from "history";
import NotFound from "@/pages/NotFound";

const App: React.FunctionComponent = () => {
  const [history] = useState(createBrowserHistory());
  return (
    <TypesafeRouter routes={routes} history={history} fallback={NotFound} />
  );
};

export default App;
