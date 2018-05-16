import React, { Component } from "react";
import { connect } from "react-redux";
import Auth from "./auth/Auth";
import { userAuthSuccess } from "./auth/actionCreators";

const style = {
  position: "absolute",
  display: "flex",
  justifyContent: "center",
  height: "100vh",
  width: "100vw",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "white"
};

const populateUserInfo = userInfo => dispatch => {
  dispatch(userAuthSuccess(userInfo));
};

class Callback extends Component {
  handleAuthentication = location => {
    if (/access_token|id_token|error/.test(location.hash)) {
      const auth = new Auth();
      auth.handleAuthentication(this.props.populateUserInfo);
    }
  };

  render() {
    this.handleAuthentication(this.props.location);
    return (
      <div style={style}>
        <p> LOADING </p>
      </div>
    );
  }
}

const mapDispatchToProps = {
  populateUserInfo
};

export default connect(undefined, mapDispatchToProps)(Callback);
