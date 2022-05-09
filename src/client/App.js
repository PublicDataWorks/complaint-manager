import UsePageTracking from "./UsePageTracking";
import React, { useEffect, useState } from "react";
import { ConnectedRouter } from "connected-react-router";
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
import { onMessage } from "./onMessage";
import getNotifications from "./policeDataManager/shared/thunks/getNotifications";
import { snackbarError } from "./policeDataManager/actionCreators/snackBarActionCreators";
import { INTERNAL_ERRORS } from "../sharedUtilities/errorMessageConstants";
import { isAuthDisabled } from "./isAuthDisabled";
import redirectToAuth from "./common/auth/redirectToAuth";


const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`);

const App = props => {
  let [eventSource, setEventSource] = useState(undefined);
  
  useEffect(() => {
    props.getFeatureToggles();

    const accessToken = getAccessToken();
    const auth = new Auth();

    if (isAuthDisabled()) {
      auth.setDummyUserInfoInStore(props.userAuthSuccess);
    }
    else if (accessToken) {
      auth.setUserInfoInStore(accessToken, props.userAuthSuccess);
    }
    else if (!window.location.pathname.includes("/data")){
      redirectToAuth(props.dispatch);
    }
  }, []);
  useEffect(() => {
    return function cleanup() {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  const token = getAccessToken();
  if (
    props.realtimeNotificationsFeature &&
    props.currentUser.nickname &&
    token &&
    !eventSource
  ) {
    setEventSource(
      (eventSource = new EventSource(
        `${
          config[process.env.REACT_APP_ENV].backendUrl
        }/api/messageStream?token=${token}`
      ))
    );

    eventSource.onmessage = event => {
      const data = event.data ? event.data : event;
      const parsedData = JSON.parse(data);

      onMessage(parsedData, props.getNotifications);
    };

    eventSource.onerror = () => {
      props.snackbarError(INTERNAL_ERRORS.NOTIFICATIONS_RETRIEVAL_FAILURE);
    };
  }

  return (
    <ConnectedRouter history={history}>
      <UsePageTracking />
      <MuiThemeProvider theme={customTheme}>
        <Paper
          elevation={0}
          style={{
            height: "100%",
            overflowY: "scroll",
            borderRadius: "0px",
            overflowX: "hidden"
          }}
        >
          <ScrollToTop>
            <AppRouter featureToggles={props.featureToggles} />
            <SharedSnackbarContainer />
          </ScrollToTop>
        </Paper>
      </MuiThemeProvider>
    </ConnectedRouter>
  );
};

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
  snackbarError,
  dispatch: arg => dispatch => dispatch(arg)
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
