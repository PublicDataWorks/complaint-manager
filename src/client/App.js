import React, { Component } from "react";
import { Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import history from "./history";
import { MuiThemeProvider } from "@material-ui/core/styles";
import customTheme from "./globalStyling/muiTheme";
import { Paper } from "@material-ui/core";
import { connect } from "react-redux";
import { userAuthSuccess } from "./auth/actionCreators";
import getAccessToken from "./auth/getAccessToken";
import Auth from "./auth/Auth";
import ScrollToTop from "./ScrollToTop";
import SharedSnackbarContainer from "./shared/components/SharedSnackbarContainer";
import getFeatureToggles from "./featureToggles/thunks/getFeatureToggles";
import AppRouter from "./AppRouter";

class App extends Component {
  componentDidMount() {
    const accessToken = getAccessToken();
    if (accessToken) {
      const auth = new Auth();
      auth.setUserInfoInStore(accessToken, this.props.userAuthSuccess);
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
              <AppRouter />
              <SharedSnackbarContainer />
            </ScrollToTop>
          </Paper>
        </MuiThemeProvider>
      </ConnectedRouter>
    );
  }
}

const mapDispatchToProps = {
  userAuthSuccess,
  getFeatureToggles
};

export default connect(
  undefined,
  mapDispatchToProps
)(App);
