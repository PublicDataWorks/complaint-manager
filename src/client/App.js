import React, { Component } from "react";
import { Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import history from "./history";
import StyleGuide from "./globalStyling/StyleGuide";
import { MuiThemeProvider } from "@material-ui/core/styles";
import customTheme from "./globalStyling/muiTheme";
import CaseDashboard from "./cases/CaseDashboard";
import { Paper } from "@material-ui/core";
import Login from "./Login";
import Callback from "./Callback";
import CaseDetails from "./cases/CaseDetails/CaseDetails";
import { connect } from "react-redux";
import { userAuthSuccess } from "./auth/actionCreators";
import getAccessToken from "./auth/getAccessToken";
import Auth from "./auth/Auth";
import ScrollToTop from "./ScrollToTop";
import { Switch } from "react-router";
import AddOfficerSearch from "./officers/OfficerSearch/AddOfficerSearch";
import EditOfficerSearch from "./officers/OfficerSearch/EditOfficerSearch";
import AddOfficerDetails from "./officers/OfficerDetails/AddOfficerDetails";
import EditOfficerDetails from "./officers/OfficerDetails/EditOfficerDetails";
import CaseHistory from "./cases/CaseDetails/CaseHistory/CaseHistory";
import AllegationSearchContainer from "./allegations/AllegationSearchContainer";
import SharedSnackbarContainer from "./shared/components/SharedSnackbarContainer";
import getFeatureToggles from "./featureToggles/thunks/getFeatureToggles";
import LetterReview from "./cases/ReferralLetter/LetterReview/LetterReview";
import OfficerHistories from "./cases/ReferralLetter/OfficerHistories/OfficerHistories";
import IAProCorrections from "./cases/ReferralLetter/IAProCorrections/IAProCorrections";
import JobDashboard from "./export/JobDashboard";
import RecommendedActions from "./cases/ReferralLetter/RecommendedActions/RecommendedActions";
import LetterPreview from "./cases/ReferralLetter/LetterPreview/LetterPreview";
import EditLetter from "./cases/ReferralLetter/EditLetter/EditLetter";
import ReviewAndApproveLetter from "./cases/ReferralLetter/ReviewAndApproveLetter/ReviewAndApproveLetter";
import ArchivedCases from "./cases/ArchivedCases";
import RedirectToCaseDashboard from "./RedirectToCaseDashboard";

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
              <Switch>
                <Route path="/login" component={Login} />
                <Route path="/callback" component={Callback} />
                <Route exact path="/archived-cases" component={ArchivedCases} />
                <Route exact path="/" component={CaseDashboard} />
                <Route
                  exact
                  path="/cases/:id/officers/search"
                  component={AddOfficerSearch}
                />
                <Route
                  exact
                  path="/cases/:id/officers/details"
                  component={AddOfficerDetails}
                />
                <Route
                  exact
                  path="/cases/:id/officers/:caseOfficerId"
                  component={EditOfficerDetails}
                />
                <Route
                  exact
                  path="/cases/:id/officers/:caseOfficerId/search"
                  component={EditOfficerSearch}
                />
                <Route
                  exact
                  path="/cases/:id/history"
                  component={CaseHistory}
                />
                <Route exact path="/cases/:id" component={CaseDetails} />
                <Route
                  exact
                  path="/cases/:id/letter/review"
                  component={LetterReview}
                />
                <Route
                  exact
                  path="/cases/:id/letter/officer-history"
                  component={OfficerHistories}
                />
                <Route
                  exact
                  path="/cases/:id/letter/iapro-corrections"
                  component={IAProCorrections}
                />
                <Route
                  exact
                  path="/cases/:id/letter/recommended-actions"
                  component={RecommendedActions}
                />
                <Route
                  exact
                  path="/cases/:id/letter/letter-preview"
                  component={LetterPreview}
                />
                <Route
                  exact
                  path="/cases/:id/letter/edit-letter"
                  component={EditLetter}
                />
                <Route
                  exact
                  path="/cases/:id/letter/review-and-approve"
                  component={ReviewAndApproveLetter}
                />
                <Route exact path="/export/all" component={JobDashboard} />
                {renderInPreProduction(
                  <Route exact path="/styleguide" component={StyleGuide} />
                )}
                <Route
                  exact
                  path="/cases/:id/cases-officers/:caseOfficerId/allegations/search"
                  component={AllegationSearchContainer}
                />
                <Route path="/cases/:id" component={RedirectToCaseDashboard} />
              </Switch>
              <SharedSnackbarContainer />
            </ScrollToTop>
          </Paper>
        </MuiThemeProvider>
      </ConnectedRouter>
    );
  }
}

const renderInPreProduction = component => {
  if (process.env.REACT_APP_ENV !== "production") {
    return component;
  }
  return null;
};

const mapDispatchToProps = {
  userAuthSuccess,
  getFeatureToggles
};

export default connect(
  undefined,
  mapDispatchToProps
)(App);
