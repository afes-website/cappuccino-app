import { Route, Router, Switch } from "react-router-dom";
import { Route as TypedRoute, PathPart } from "typesafe-react-router";
import React, { PropsWithChildren } from "react";
import { History } from "history";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PathPartArray = Array<PathPart<any>>;

type TypedRouteWithComponent<
  P extends PathPartArray = [],
  Q extends string[] = []
> = {
  route: TypedRoute<P, Q>;
  component: React.ComponentType<{
    match: { params: Parameters<TypedRoute<P, Q>["create"]>[0] };
  }>;
};

export function typedRoute<
  P extends PathPartArray = [],
  Q extends string[] = []
>(
  route: TypedRoute<P, Q>,
  component: React.ComponentType<{
    match: { params: Parameters<TypedRoute<P, Q>["create"]>[0] };
  }>
): TypedRouteWithComponent<P, Q> {
  return { route, component };
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routes: { [key: string]: TypedRouteWithComponent<any, any> };
  history: History;
  layout: React.ComponentType<PropsWithChildren<unknown>>;
  fallback: React.VFC;
}

const TypesafeRouter: React.VFC<Props> = ({ layout: Layout, ...props }) => (
  <Router history={props.history}>
    <Layout>
      <Switch>
        {Object.values(props.routes).map((route) => (
          <Route
            exact
            key={route.route.template()}
            path={route.route.template()}
            component={route.component}
          />
        ))}
        <Route component={props.fallback} />
      </Switch>
    </Layout>
  </Router>
);

export default TypesafeRouter;
