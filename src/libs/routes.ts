import { typedRoute } from "@/components/TypesafeRouter";
import { route } from "typesafe-react-router";
import Home from "@/pages/Home";
import EnterScan from "@/pages/exh/EnterScan";
import ExitScan from "@/pages/exh/ExitScan";

const routes = {
  Home: typedRoute(route(""), Home),
  ExhEnterScan: typedRoute(route("exh/enter"), EnterScan),
  ExhExitScan: typedRoute(route("exh/exit"), ExitScan),
};

export default routes;
