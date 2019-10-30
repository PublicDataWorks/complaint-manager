import React, { Component } from "react";
import Auth from "./common/auth/Auth";

class Login extends Component {
  componentDidMount() {
    const auth = new Auth();
    auth.login();
  }

  render() {
    return <div />;
  }
}

export default Login;
