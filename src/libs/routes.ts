import { typedRoute } from "@/components/typesafeRouter";
import { route } from "typesafe-react-router";
import Home from "@/pages/Home";

const routes = {
  Home: typedRoute(route(""), Home),
};

export default routes;
