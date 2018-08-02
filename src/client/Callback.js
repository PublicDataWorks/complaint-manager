import React, { Component } from "react";
import { connect } from "react-redux";
import Auth from "./auth/Auth";
import { userAuthSuccess } from "./auth/actionCreators";
import getFeatureToggles from "./featureToggles/thunks/getFeatureToggles";

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

class Callback extends Component {
  handleAuthentication = location => {
    if (/access_token|id_token|error/.test(location.hash)) {
      const auth = new Auth();
      auth.handleAuthentication(
        this.props.userAuthSuccess,
        this.props.getFeatureToggles
      );
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
  userAuthSuccess,
  getFeatureToggles
};

export default connect(undefined, mapDispatchToProps)(Callback);
