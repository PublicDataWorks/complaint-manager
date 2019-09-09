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

export default class App extends Component {
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
