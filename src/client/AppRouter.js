import React, { Component } from "react";
import complaintManagerRoutes from "./complaintManagerRoutes";
import StyleGuide from "./globalStyling/StyleGuide";
import sharedRoutes from "./sharedRoutes";
import disciplinaryProceedingsRoutes from "./disciplinaryProceedingsRoutes";
import { connect } from "react-redux";
import getFeatureToggles from "./featureToggles/thunks/getFeatureToggles";
import { Route, Switch } from "react-router";

class AppRouter extends Component {
  componentDidMount() {
    this.props.getFeatureToggles();
  }

  render() {
    return (
      <Switch>
        {renderInPreProduction(
          <Route exact path="/styleguide" component={StyleGuide} />
        )}
        {sharedRoutes.map(route =>
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

const renderInPreProduction = component => {
  if (process.env.REACT_APP_ENV !== "production") {
    return component;
  }
  return null;
};

const mapStateToProps = state => ({
  featureToggles: state.featureToggles
});

const mapDispatchToProps = {
  getFeatureToggles
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppRouter);
