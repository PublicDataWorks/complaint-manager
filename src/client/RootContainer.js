import React from "react";
import { Provider } from "react-redux";
import { push } from "connected-react-router";
import { Security } from "@okta/okta-react";
import createConfiguredStore from "./createConfiguredStore";
import App from "./App";
import configureInterceptors from "./common/axiosInterceptors/interceptors";
import { OKTA } from "../sharedUtilities/constants";
import OktaAuth, { toRelativeUrl } from "@okta/okta-auth-js";
import history from "./history";

const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

const store = createConfiguredStore();

configureInterceptors(store);

const oktaAuth =
  config.auth.engine === OKTA
    ? new OktaAuth({
        issuer: `https://${config.auth.domain}/oauth2/default`,
        clientId: config.auth.clientID,
        redirectUri: config.auth.redirectUri,
        responseType: "code"
      })
    : undefined;

const RootContainer = () => (
  <Provider store={store}>
    {config.auth.engine === OKTA ? (
      <Security
        oktaAuth={oktaAuth}
        restoreOriginalUri={auth => {
          localStorage.setItem("access_token", auth.getAccessToken());
          localStorage.setItem("id_token", auth.getIdToken());
          localStorage.setItem("expires_at", Date.now() + 1000 * 60 * 55);
          history.replace(
            toRelativeUrl(
              localStorage.getItem("redirectUri") || "/",
              window.location.origin
            )
          );
        }}
      >
        <App />
      </Security>
    ) : (
      <App />
    )}
  </Provider>
);

export default RootContainer;
