import React from "react";
import { connect } from "react-redux";
import { Security } from "@okta/okta-react";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import history from "../../client/history";
import { userAuthSuccess } from "../../client/common/auth/actionCreators";
import Auth from "../../client/common/auth/Auth";

const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

const oktaAuth = new OktaAuth({
  issuer: config.auth.issuer,
  clientId: config.auth.clientID,
  redirectUri: config.auth.redirectUri,
  responseType: "code"
});

export const withSecurity = Component => {
  const WrappedComponent = props => (
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
      <Component />
    </Security>
  );

  return connect(undefined, { userAuthSuccess })(WrappedComponent);
};
