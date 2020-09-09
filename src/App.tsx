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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const redirect_to_login = () => {
    if (
      !provideVal.val.get_current_user_id() &&
      history.location.pathname !== routes.Login.route.create({})
    ) {
      history.push(routes.Login.route.create({}));
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(redirect_to_login, [provideVal]);
  React.useEffect(() => {
    return history.listen(redirect_to_login);
  });

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
