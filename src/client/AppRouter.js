import React, { Component, Suspense } from "react";
import { Route, Switch } from "react-router";
import { connect } from "react-redux";
import { CircularProgress } from "@material-ui/core";
import policeDataManagerRoutes from "./policeDataManagerRoutes";
import sharedRoutes from "./sharedRoutes";
import publicDataDashboardRoutes from "./publicDataDashboardRoutes";

class AppRouter extends Component {
  render() {
    return (
      <Suspense
        fallback={
          <CircularProgress
            data-testid="spinner"
            style={{ marginTop: "100px", marginBottom: "32px" }}
            size={80}
          />
        }
      >
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
              this.createRoute(route.path, route.component, route.title)
          )}
        </Switch>
      </Suspense>
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

  setPageTitle = title => {
    document.title = title ? title : "Complaint Manager";
  };

  createRoute = (path, component, title) => {
    let RouteComponent = component;
    const routeComponentBuilder = props => {
      if (path === "/callback") {
        return (
          <RouteComponent
            {...props}
            errorComponent={() => {
              globalThis.location = "/login";
              return null;
            }}
          />
        );
      } else {
        return <RouteComponent {...props} />;
      }
    };

    return (
      <Route
        exact
        key={path}
        path={path}
        render={props => {
          this.setPageTitle(title);
          return <div>{routeComponentBuilder(props)}</div>;
        }}
      />
    );
  };
}

const mapStateToProps = state => ({
  featureToggles: state.featureToggles
});

export default connect(mapStateToProps)(AppRouter);
