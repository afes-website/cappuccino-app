import { typedRoute } from "components/TypesafeRouter";
import { route } from "typesafe-react-router";
import Home from "pages/Home";
import Login from "pages/Login";
import LoginWithQR from "pages/LoginWithQR";
import Account from "pages/Account";
import Forbidden from "pages/Forbidden";
import Terms from "pages/Terms";
import CheckInScan from "pages/executive/CheckInScan";
import CheckOutScan from "pages/executive/CheckOutScan";
import RegisterSpare from "pages/executive/RegisterSpare";
import AllExhStatus from "pages/executive/AllExhStatus";
import GuestInfo from "pages/executive/GuestInfo";
import RsvQRTester from "pages/executive/RsvQRTester";
import HeatMap from "pages/executive/HeatMap";
import EnterScan from "pages/exhibition/EnterScan";
import ExitScan from "pages/exhibition/ExitScan";
import ScanHistory from "pages/exhibition/ScanHistory";

const routes = {
  Home: typedRoute(route(""), Home),
  Login: typedRoute(route("login"), Login),
  LoginWithQR: typedRoute(route("login/qr"), LoginWithQR),
  Account: typedRoute(route("account"), Account),
  Forbidden: typedRoute(route("forbidden"), Forbidden),
  Terms: typedRoute(route("terms"), Terms),
  CheckInScan: typedRoute(route("executive/check-in"), CheckInScan),
  CheckOutScan: typedRoute(route("executive/check-out"), CheckOutScan),
  RegisterSpare: typedRoute(route("executive/register-spare"), RegisterSpare),
  AllExhStatus: typedRoute(route("executive/status"), AllExhStatus),
  GuestInfo: typedRoute(route("executive/info"), GuestInfo),
  RsvQRTester: typedRoute(route("executive/rsv-qr"), RsvQRTester),
  HeatMap: typedRoute(route("executive/heatmap"), HeatMap),
  EnterScan: typedRoute(route("exhibition/enter"), EnterScan),
  ExitScan: typedRoute(route("exhibition/exit"), ExitScan),
  ScanHistory: typedRoute(route("exhibition/history"), ScanHistory),
};

export default routes;
