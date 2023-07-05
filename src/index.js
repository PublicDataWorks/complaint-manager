import React from "react";
import { render } from "react-dom";
import "./index.css";
import configureInterceptors from "./client/common/axiosInterceptors/interceptors";
import createConfiguredStore from "./client/createConfiguredStore";
import RootContainer from "./client/RootContainer";
import logger from "./client/logger";
import { Provider } from "react-redux";

if (process.env.REACT_APP_ENV !== "test")
  window.addEventListener("error", ({ message }) => logger.error(message));

const store = createConfiguredStore();

configureInterceptors(store);

render(
  <Provider store={store}>
    <RootContainer />
  </Provider>,
  document.getElementById("root")
);
