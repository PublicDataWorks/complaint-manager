import React, { Component } from "react";
import { ConnectedRouter } from "connected-react-router";
import { get } from 'lodash';
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
import { onMessage } from "./onMessage";
import getNotifications from "./complaintManager/shared/thunks/getNotifications";
import { snackbarError } from "./complaintManager/actionCreators/snackBarActionCreators";
import { INTERNAL_ERRORS } from "../sharedUtilities/errorMessageConstants";

class App extends Component {
  eventSource = undefined;

  componentDidMount() {
    const accessToken = getAccessToken();
    const auth = new Auth();
    if (get(config, [process.env.REACT_APP_ENV, 'auth', 'disabled'], false)) {
      auth.setDummyUserInfoInStore(this.props.userAuthSuccess);
    }

    if (accessToken) {
      auth.setUserInfoInStore(accessToken, this.props.userAuthSuccess);
      this.props.getFeatureToggles();
    }
  }

  componentWillUnmount() {
    this.eventSource.close();
  }

  render() {
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
    state.featureToggles.realtimeNotificationsFeature
});

const mapDispatchToProps = {
  userAuthSuccess,
  getFeatureToggles,
  getNotifications,
  snackbarError
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
