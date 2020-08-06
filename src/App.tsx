import React, { useState } from "react";
import TypesafeRouter from "@/components/typesafeRouter";
import routes from "@/libs/routes";
import { createBrowserHistory } from "history";

const App: React.FunctionComponent = () => {
  const [history] = useState(createBrowserHistory());
  return <TypesafeRouter routes={routes} history={history} />;
};

export default App;
