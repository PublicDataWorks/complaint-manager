import React, { Component } from "react";
import { Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import history from "./history";
import { MuiThemeProvider } from "@material-ui/core/styles";
import customTheme from "./common/globalStyling/muiTheme";
import { Paper } from "@material-ui/core";
import ScrollToTop from "./ScrollToTop";
import SharedSnackbarContainer from "./complaintManager/shared/components/SharedSnackbarContainer";
import AppRouter from "./AppRouter";
import getAccessToken from "./common/auth/getAccessToken";
import Auth from "./common/auth/Auth";
import { connect } from "react-redux";
import { userAuthSuccess } from "./common/auth/actionCreators";
import getFeatureToggles from "./complaintManager/featureToggles/thunks/getFeatureToggles";
import config from "./common/config/config";

class App extends Component {
  eventSource = undefined;

  componentDidMount() {
    const accessToken = getAccessToken();
    if (accessToken) {
      const auth = new Auth();
      auth.setUserInfoInStore(accessToken, this.props.userAuthSuccess);
      this.props.getFeatureToggles();
    }
  }

  render() {
    const token = getAccessToken();
    if (
      this.props.realtimeNotificationsFeature &&
      this.props.currentUser.nickname &&
      token &&
      !this.eventSource
    ) {
      console.log("Creating EventSource for ", this.props.currentUser.nickname);

      this.eventSource = new EventSource(
        `${
          config[process.env.REACT_APP_ENV].backendUrl
        }/api/notificationStream?token=${token}`
      );

      this.eventSource.onmessage = event => {
        const parsedData = JSON.parse(event.data);
        console.log("Event from Server: ", parsedData);
      };
      this.eventSource.onerror = event => {
        console.log("Error from Event Stream", event);
      };
    }

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
  currentUser: state.users.current.userInfo,
  featureToggles: state.featureToggles,
  realtimeNotificationsFeature:
    state.featureToggles.realtimeNotificationsFeature
});

const mapDispatchToProps = {
  userAuthSuccess,
  getFeatureToggles
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
