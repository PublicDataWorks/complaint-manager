import React from "react";
import { Provider } from "react-redux";
import createConfiguredStore from "./createConfiguredStore";
import App from "./App";
import configureInterceptors from "./axiosInterceptors/interceptors";

const store = createConfiguredStore();

configureInterceptors(store);

const RootContainer = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default RootContainer;
