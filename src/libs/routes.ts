import { typedRoute } from "components/TypesafeRouter";
import { route } from "typesafe-react-router";
import Home from "pages/Home";
import Login from "pages/Login";
import Forbidden from "pages/Forbidden";
import Terms from "pages/Terms";
import ExhEnterScan from "pages/exh/EnterScan";
import ExhExitScan from "pages/exh/ExitScan";
import ExhScanHistory from "pages/exh/ScanHistory";
import GeneralEnterScan from "pages/general/EnterScan";
import GeneralExitScan from "pages/general/ExitScan";
import AllExhStatus from "pages/general/AllExhStatus";

const routes = {
  Home: typedRoute(route(""), Home),
  Login: typedRoute(route("login"), Login),
  Forbidden: typedRoute(route("forbidden"), Forbidden),
  Terms: typedRoute(route("terms"), Terms),
  ExhEnterScan: typedRoute(route("exh/enter"), ExhEnterScan),
  ExhExitScan: typedRoute(route("exh/exit"), ExhExitScan),
  ExhScanHistory: typedRoute(route("exh/history"), ExhScanHistory),
  GeneralEnterScan: typedRoute(route("general/enter"), GeneralEnterScan),
  GeneralExitScan: typedRoute(route("general/exit"), GeneralExitScan),
  AllExhStatus: typedRoute(route("general/status"), AllExhStatus),
};

export default routes;
