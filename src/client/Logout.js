import React, { Component } from "react";
import Auth from "./common/auth/Auth";
import handleLogout from "./policeDataManager/users/thunks/handleLogout";

class Logout extends Component {
  componentDidMount() {
    handleLogout();
  }

  render() {
    return <div />;
  }
}

export default Logout;
