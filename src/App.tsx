import React, { useState } from "react";
import TypesafeRouter from "@/components/TypesafeRouter";
import routes from "@/libs/routes";
import { createBrowserHistory } from "history";
import NotFound from "@/pages/NotFound";
import MainLayout from "@/layouts/Main";

const App: React.FunctionComponent = () => {
  const [history] = useState(createBrowserHistory());

  return (
    <TypesafeRouter
      routes={routes}
      history={history}
      layout={MainLayout}
      fallback={NotFound}
    />
  );
};

export default App;
