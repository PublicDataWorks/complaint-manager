import React, { Component } from "react";
import complaintManagerRoutes from "./complaintManagerRoutes";
import sharedRoutes from "./sharedRoutes";
import disciplinaryProceedingsRoutes from "./disciplinaryProceedingsRoutes";
import { connect } from "react-redux";
import getFeatureToggles from "./featureToggles/thunks/getFeatureToggles";
import { Route, Switch } from "react-router";
import getAccessToken from "./auth/getAccessToken";
import Auth from "./auth/Auth";
import { userAuthSuccess } from "./auth/actionCreators";

class AppRouter extends Component {
  componentDidMount() {
    const accessToken = getAccessToken();
    if (accessToken) {
      const auth = new Auth();
      auth.setUserInfoInStore(accessToken, this.props.userAuthSuccess);
      this.props.getFeatureToggles();
    }
  }

  render() {
    return (
      <Switch>
        {sharedRoutes.map(
          route =>
            this.shouldCreateRoute(route.toggleName) &&
            this.createRoute(route.path, route.component)
        )}
        {complaintManagerRoutes.map(route =>
          this.createRoute(route.path, route.component)
        )}
        {disciplinaryProceedingsRoutes.map(
          route =>
            this.shouldCreateRoute(route.toggleName) &&
            this.createRoute(route.path, route.component)
        )}
      </Switch>
    );
  }

  shouldCreateRoute = toggleName => {
    if (toggleName) {
      const toggleState = this.props.featureToggles[toggleName];
      if (toggleState === false) {
        return false;
      }
    }
    return true;
  };

  createRoute = (path, component) => (
    <Route exact key={path} path={path} component={component} />
  );
}

const mapStateToProps = state => ({
  featureToggles: state.featureToggles
});

const mapDispatchToProps = {
  userAuthSuccess,
  getFeatureToggles
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppRouter);
