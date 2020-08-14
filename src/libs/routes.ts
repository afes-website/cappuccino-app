import { typedRoute } from "@/components/typesafeRouter";
import { route } from "typesafe-react-router";
import Home from "@/pages/Home";
import Scan from "@/pages/Scan";

const routes = {
  Home: typedRoute(route(""), Home),
  Scan: typedRoute(route("scan"), Scan),
};

export default routes;
