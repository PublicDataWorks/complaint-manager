import React from "react";
import { connect } from "react-redux";
import Auth from "../../client/common/auth/Auth";
import { userAuthSuccess } from "../../client/common/auth/actionCreators";
import getFeatureToggles from "../../client/policeDataManager/globalData/thunks/getFeatureToggles";

class CallbackComponent extends React.Component {
  componentDidMount() {
    this.handleAuthentication();
  }

  handleAuthentication() {
    const { location, userAuthSuccess, getFeatureToggles } = this.props;
    if (/access_token|id_token|error/.test(location.hash))
      new Auth().handleAuthentication(userAuthSuccess, getFeatureToggles);
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = {
  userAuthSuccess,
  getFeatureToggles
};

export const Callback = connect(null, mapDispatchToProps)(CallbackComponent);
