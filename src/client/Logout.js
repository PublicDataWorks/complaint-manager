import React, { Component } from "react";
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
