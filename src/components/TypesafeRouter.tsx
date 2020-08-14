import { Route, Router, Switch } from "react-router-dom";
import { Route as TypedRoute, PathPart } from "typesafe-react-router";
import React from "react";
import { History } from "history";
import PropTypes from "prop-types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PathPartArray = Array<PathPart<any>>;

export type TypedRouteWithComponent<
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
  routes: { [key: string]: TypedRouteWithComponent<PathPartArray, string[]> };
  history: History;
  fallback: React.FunctionComponent;
}

const TypesafeRouter: React.FunctionComponent<Props> = (props) => (
  <Router history={props.history}>
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
  </Router>
);

TypesafeRouter.propTypes = {
  routes: PropTypes.any,
  history: PropTypes.any,
  fallback: PropTypes.any,
};

export default TypesafeRouter;
