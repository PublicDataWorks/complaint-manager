import React, { Component } from "react";
import { ConnectedRouter } from "connected-react-router";
import { get } from "lodash";
import history from "./history";
import { MuiThemeProvider } from "@material-ui/core/styles";
import customTheme from "./common/globalStyling/muiTheme";
import { Paper } from "@material-ui/core";
import ScrollToTop from "./ScrollToTop";
import SharedSnackbarContainer from "./policeDataManager/shared/components/SharedSnackbarContainer";
import AppRouter from "./AppRouter";
import getAccessToken from "./common/auth/getAccessToken";
import Auth from "./common/auth/Auth";
import { connect } from "react-redux";
import { userAuthSuccess } from "./common/auth/actionCreators";
import getFeatureToggles from "./policeDataManager/featureToggles/thunks/getFeatureToggles";
import config from "./common/config/config";
import { onMessage } from "./onMessage";
import getNotifications from "./policeDataManager/shared/thunks/getNotifications";
import { snackbarError } from "./policeDataManager/actionCreators/snackBarActionCreators";
import { INTERNAL_ERRORS } from "../sharedUtilities/errorMessageConstants";
import { isAuthDisabled } from "./isAuthDisabled";
import ReactGA from "react-ga";

const analyticsTrackingID = "UA-184896339-1";

class App extends Component {
  eventSource = undefined;

  componentDidMount() {
    this.props.getFeatureToggles();

    const accessToken = getAccessToken();
    const auth = new Auth();
    if (isAuthDisabled()) {
      auth.setDummyUserInfoInStore(this.props.userAuthSuccess);
    }

    if (accessToken) {
      auth.setUserInfoInStore(accessToken, this.props.userAuthSuccess);
    }
  }

  componentWillUnmount() {
    this.eventSource.close();
  }

  render() {
    if (this.props.analyticsCollectionFeature) {
      console.log("Initializing Analytics");
      ReactGA.initialize(analyticsTrackingID);
    }
    const token = getAccessToken();
    if (
      this.props.realtimeNotificationsFeature &&
      this.props.currentUser.nickname &&
      token &&
      !this.eventSource
    ) {
      this.eventSource = new EventSource(
        `${
          config[process.env.REACT_APP_ENV].backendUrl
        }/api/messageStream?token=${token}`
      );

      this.eventSource.onmessage = event => {
        const data = event.data ? event.data : event;
        const parsedData = JSON.parse(data);

        onMessage(parsedData, this.props.getNotifications);
      };

      this.eventSource.onerror = () => {
        this.props.snackbarError(
          INTERNAL_ERRORS.NOTIFICATIONS_RETRIEVAL_FAILURE
        );
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
    state.featureToggles.realtimeNotificationsFeature,
  analyticsCollectionFeature: state.featureToggles.analyticsCollectionFeature
});

const mapDispatchToProps = {
  userAuthSuccess,
  getFeatureToggles,
  getNotifications,
  snackbarError
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
