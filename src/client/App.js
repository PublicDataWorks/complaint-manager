import React, { Component } from "react";
import { Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import history from "./history";
import { MuiThemeProvider } from "@material-ui/core/styles";
import customTheme from "./globalStyling/muiTheme";
import { Paper } from "@material-ui/core";
import ScrollToTop from "./ScrollToTop";
import SharedSnackbarContainer from "./shared/components/SharedSnackbarContainer";
import AppRouter from "./AppRouter";
import getAccessToken from "./auth/getAccessToken";
import Auth from "./auth/Auth";
import { connect } from "react-redux";
import { userAuthSuccess } from "./auth/actionCreators";
import getFeatureToggles from "./featureToggles/thunks/getFeatureToggles";

class App extends Component {
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
      <ConnectedRouter history={history}>
        <MuiThemeProvider theme={customTheme}>
          <Paper
            elevation={0}
            style={{ height: "100%", overflowY: "scroll", borderRadius: "0px" }}
          >
            <ScrollToTop>
              <AppRouter featureToggles={this.props.featureToggles} />
              <SharedSnackbarContainer />
            </ScrollToTop>
          </Paper>
        </MuiThemeProvider>
      </ConnectedRouter>
    );
  }
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
)(App);
