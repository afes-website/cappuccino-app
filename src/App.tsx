import React, { useState } from "react";
import TypesafeRouter from "@/components/TypesafeRouter";
import routes from "@/libs/routes";
import { createBrowserHistory } from "history";
import NotFound from "@/pages/NotFound";
import MainLayout from "@/layouts/Main";
import Auth, { AuthContext } from "@/libs/auth";

const App: React.FunctionComponent = () => {
  const [history] = useState(createBrowserHistory());
  const [provideVal, setProvideVal] = React.useState(() => ({
    val: new Auth(),
  }));
  React.useEffect(() => {
    provideVal.val.on_change(() => {
      setProvideVal((old) => ({ ...old }));
    });
  }, []);

  return (
    <AuthContext.Provider value={provideVal}>
      <TypesafeRouter
        routes={routes}
        history={history}
        layout={MainLayout}
        fallback={NotFound}
      />
    </AuthContext.Provider>
  );
};

export default App;
