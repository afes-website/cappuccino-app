import React from "react";
import ReactDOM from "react-dom";
import App from "App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "assets/scss/main.scss";
import Axios from "axios";

Axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    if (registration.waiting) {
      registration.waiting?.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  },
});
