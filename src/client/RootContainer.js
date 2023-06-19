import React from "react";
import { connect } from "react-redux";
import { Security } from "@okta/okta-react";
import App from "./App";
import { OKTA } from "../sharedUtilities/constants";
import OktaAuth, { toRelativeUrl } from "@okta/okta-auth-js";
import history from "./history";
import { userAuthSuccess } from "./common/auth/actionCreators";
import Auth from "./common/auth/Auth";

const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

const oktaAuth =
  config.auth.engine === OKTA
    ? new OktaAuth({
        issuer: config.auth.issuer,
        clientId: config.auth.clientID,
        redirectUri: config.auth.redirectUri,
        responseType: "code"
      })
    : undefined;

const RootContainer = props => (
  <>
    {config.auth.engine === OKTA ? (
      <Security
        oktaAuth={oktaAuth}
        restoreOriginalUri={auth => {
          localStorage.setItem("access_token", auth.getAccessToken());
          localStorage.setItem("id_token", auth.getIdToken());
          localStorage.setItem("expires_at", Date.now() + 1000 * 60 * 55);
          const auth2 = new Auth();
          auth2.setUserInfoInStore(
            localStorage.getItem("access_token"),
            props.userAuthSuccess
          );
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
  </>
);
const mapDispatchToProps = {
  userAuthSuccess
};

export default connect(undefined, mapDispatchToProps)(RootContainer);
