import { Route, Router } from "react-router-dom";
import { Route as TypedRoute, PathPart } from "typesafe-react-router";
import React from "react";
import { History } from "history";
import PropTypes from "prop-types";

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
  routes: { [key: string]: TypedRouteWithComponent<PathPartArray, string[]> };
  history: History;
}

const TypesafeRouter: React.FunctionComponent<Props> = (props) => (
  <Router history={props.history}>
    {Object.values(props.routes).map((route) => (
      <Route
        exact
        key={route.route.template()}
        path={route.route.template()}
        component={route.component}
      />
    ))}
  </Router>
);

TypesafeRouter.propTypes = {
  routes: PropTypes.any,
  history: PropTypes.any,
};

export default TypesafeRouter;
