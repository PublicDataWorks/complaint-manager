import React from "react";
import { connect } from "react-redux";
import Auth from "./common/auth/Auth";
import { userAuthSuccess } from "./common/auth/actionCreators";
import getFeatureToggles from "./policeDataManager/globalData/thunks/getFeatureToggles";
import { LoginCallback } from "@okta/okta-react";
import { OKTA } from "../sharedUtilities/constants";

const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

class Callback extends React.Component {
  componentDidMount() {
    if (config.auth.engine !== OKTA) {
      this.handleAuthentication();
    }
  }

  handleAuthentication() {
    const { location, userAuthSuccess, getFeatureToggles } = this.props;
    if (/access_token|id_token|error/.test(location.hash))
      new Auth().handleAuthentication(userAuthSuccess, getFeatureToggles);
  }

  render() {
    return config.auth.engine === OKTA ? (
      <LoginCallback onAuthResume={this.handleAuthentication.bind(this)} />
    ) : null;
  }
}

const mapDispatchToProps = {
  userAuthSuccess,
  getFeatureToggles
};

export default connect(null, mapDispatchToProps)(Callback);
