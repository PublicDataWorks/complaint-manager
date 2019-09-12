import React, { Component } from "react";
import complaintManagerRoutes from "./complaintManagerRoutes";
import sharedRoutes from "./sharedRoutes";
import disciplinaryProceedingsRoutes from "./disciplinaryProceedingsRoutes";
import { Route, Switch } from "react-router";

export default class AppRouter extends Component {
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
