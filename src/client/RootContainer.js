import React from "react";
import { Provider } from "react-redux";
import createConfiguredStore from "./createConfiguredStore";
import App from "./App";

const RootContainer = () => (
  <Provider store={createConfiguredStore()}>
    <App />
  </Provider>
);

export default RootContainer;
