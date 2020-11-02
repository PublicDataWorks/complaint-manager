import React, { Component } from "react";
import policeDataManagerRoutes from "./policeDataManagerRoutes";
import sharedRoutes from "./sharedRoutes";
import publicDataDashboardRoutes from "./publicDataDashboardRoutes";
import { Route, Switch } from "react-router";
import { connect } from "react-redux";

class AppRouter extends Component {
  render() {
    return (
      <Switch>
        {sharedRoutes.map(
          route =>
            this.shouldCreateRoute(route.toggleName) &&
            this.createRoute(route.path, route.component)
        )}
        {policeDataManagerRoutes.map(
          route =>
            this.shouldCreateRoute(route.toggleName) &&
            this.createRoute(route.path, route.component)
        )}
        {publicDataDashboardRoutes.map(
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

  createRoute = (path, component) => {
    return <Route exact key={path} path={path} component={component} />;
  };
}

const mapStateToProps = state => ({
  featureToggles: state.featureToggles
});

export default connect(mapStateToProps)(AppRouter);
