import React from "react";
import ReactDOM from "react-dom";
import App from "@/App";
import * as serviceWorker from "@/serviceWorker";
import "@/assets/scss/main.scss";
import Axios from "axios";

Axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
