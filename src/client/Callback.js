import React, { Component } from "react";
import { connect } from "react-redux";
import Auth from "./auth/Auth";
import { userAuthSuccess } from "./auth/actionCreators";
import getFeatureToggles from "./featureToggles/thunks/getFeatureToggles";

class Callback extends Component {

  componentDidMount() {
    const { location, userAuthSuccess, getFeatureToggles } = this.props;
    if (/access_token|id_token|error/.test(location.hash))
      new Auth().handleAuthentication(userAuthSuccess, getFeatureToggles);
  }

  render() {
    return null
  }
}

export default connect(
  null, { userAuthSuccess, getFeatureToggles }
)(Callback);
