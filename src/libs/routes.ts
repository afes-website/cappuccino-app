import { typedRoute } from "@/components/TypesafeRouter";
import { route } from "typesafe-react-router";
import Home from "@/pages/Home";
import ExhEnterScan from "@/pages/exh/EnterScan";
import ExhExitScan from "@/pages/exh/ExitScan";
import ExhScanHistory from "@/pages/exh/ScanHistory";

const routes = {
  Home: typedRoute(route(""), Home),
  ExhEnterScan: typedRoute(route("exh/enter"), ExhEnterScan),
  ExhExitScan: typedRoute(route("exh/exit"), ExhExitScan),
  ExhScanHistory: typedRoute(route("exh/history"), ExhScanHistory),
};

export default routes;
