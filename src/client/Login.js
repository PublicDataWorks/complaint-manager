import React, { Component } from "react";
import Auth from "./common/auth/Auth";
import { OKTA } from "../sharedUtilities/constants";
import { withOktaAuth } from "@okta/okta-react";

const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

class Login extends Component {
  componentDidMount() {
    if (config.auth.engine === OKTA) {
      this.props.oktaAuth.signInWithRedirect();
    } else {
      const auth = new Auth();
      auth.login();
    }
  }

  render() {
    return <div />;
  }
}

const WrappedLogin = config.auth.engine === OKTA ? withOktaAuth(Login) : Login;

export default WrappedLogin;
