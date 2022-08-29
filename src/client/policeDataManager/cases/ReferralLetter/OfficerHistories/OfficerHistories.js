import React, { Component } from "react";
import NavBar from "../../../shared/components/NavBar/NavBar";
import { Card, CardContent, Typography } from "@material-ui/core";
import LinkButton from "../../../shared/components/LinkButton";
import LetterProgressStepper from "../LetterProgressStepper";
import { connect } from "react-redux";
import { LETTER_PROGRESS } from "../../../../../sharedUtilities/constants";
import _ from "lodash";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import OfficerHistoryTabContent from "./OfficerHistoryTabContent";
import { FieldArray, reduxForm } from "redux-form";
import WarningMessage from "../../../shared/components/WarningMessage";
import RemoveOfficerHistoryNoteDialog from "./RemoveOfficerHistoryNoteDialog";
import getReferralLetterData from "../thunks/getReferralLetterData";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";
import editOfficerHistory from "../thunks/editOfficerHistory";
import LetterStatusMessage from "../../CaseDetails/LetterStatusMessage/LetterStatusMessage";
import getCaseDetails from "../../thunks/getCaseDetails";
import getReferralLetterEditStatus from "../thunks/getReferralLetterEditStatus";
import getMinimumCaseDetails from "../../thunks/getMinimumCaseDetails";
import { push } from "connected-react-router";
import { policeDataManagerMenuOptions } from "../../../shared/components/NavBar/policeDataManagerMenuOptions";

class OfficerHistories extends Component {
  constructor(props) {
    super(props);
    let selectedTab;
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.selectedTab
    ) {
      selectedTab = this.props.location.state.selectedTab;
    } else {
      selectedTab = 0;
    }
    this.state = {
      selectedTab: selectedTab,
      caseId: this.props.match.params.id
    };
  }

  componentDidMount() {
    this.props.getReferralLetterData(this.state.caseId);
    this.props.getReferralLetterEditStatus(this.state.caseId);
    this.props.getCaseDetails(this.state.caseId);
  }

  saveAndReturnToCase = () => {
    return this.props.handleSubmit(
      this.submitForm(`/cases/${this.state.caseId}`)
    );
  };

  saveAndGoBackToReview = () => {
    return this.props.handleSubmit(
      this.submitForm(`/cases/${this.state.caseId}/letter/review`)
    );
  };

  saveAndGoToNextPage = () => {
    return this.props.handleSubmit(
      this.submitForm(`/cases/${this.state.caseId}/letter/recommended-actions`)
    );
  };

  pageChangeCallback = redirectUrl => {
    return this.props.handleSubmit(this.submitForm(redirectUrl));
  };

  submitForm = redirectUrl => (values, dispatch) => {
    if (values.letterOfficers.length === 0) {
      dispatch(push(redirectUrl));
    } else {
      dispatch(editOfficerHistory(this.state.caseId, values, redirectUrl));
    }
  };

  referralLetterNotYetLoaded() {
    return (
      _.isEmpty(this.props.letterDetails) ||
      `${this.props.letterDetails.caseId}` !== this.state.caseId
    );
  }

  handleTabChange = (event, selectedTab) => {
    this.setState({ selectedTab });
  };

  renderTabHeaders = () => {
    return this.props.letterDetails.letterOfficers.map(letterOfficer => {
      return (
        <Tab
          key={letterOfficer.caseOfficerId}
          label={letterOfficer.fullName}
          data-testid={`tab-${letterOfficer.caseOfficerId}`}
        />
      );
    });
  };

  renderOfficerFields = ({ fields, selectedTab }) => {
    return fields.map((letterOfficerField, index) => {
      const isSelectedOfficer = index === selectedTab;
      const letterOfficerInstance = fields.get(index);
      return (
        <OfficerHistoryTabContent
          letterOfficer={letterOfficerField}
          letterOfficerIndex={index}
          caseOfficerName={letterOfficerInstance.fullName}
          caseOfficerId={letterOfficerInstance.caseOfficerId}
          key={letterOfficerInstance.caseOfficerId}
          isSelectedOfficer={isSelectedOfficer}
        />
      );
    });
  };

  renderNoOfficers = () => {
    return (
      <WarningMessage
        variant="grayText"
        data-testid="no-officers-message"
        style={{ margin: "0 0 32px" }}
      >
        There are no officers on this case
      </WarningMessage>
    );
  };

  renderOfficerHistories = () => {
    return (
      <Card style={{ margin: "0 0 32px" }}>
        <CardContent style={{ backgroundColor: "white", padding: 0 }}>
          <AppBar
            position="static"
            style={{ backgroundColor: "white" }}
            color="default"
          >
            <Tabs
              value={this.state.selectedTab}
              onChange={this.handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              {this.renderTabHeaders()}
            </Tabs>
          </AppBar>
          <FieldArray
            name="letterOfficers"
            component={this.renderOfficerFields}
            selectedTab={this.state.selectedTab}
          />
        </CardContent>
      </Card>
    );
  };

  render() {
    if (this.referralLetterNotYetLoaded()) {
      return null;
    }
    const letterOfficers = this.props.letterDetails.letterOfficers;

    return (
      <div>
        <NavBar menuType={policeDataManagerMenuOptions}>
          {`Case #${this.props.caseReference}   : Letter Generation`}
        </NavBar>

        <form>
          <LinkButton
            data-testid="save-and-return-to-case-link"
            onClick={this.saveAndReturnToCase()}
            style={{ margin: "2% 0% 2% 4%" }}
          >
            Back to Case
          </LinkButton>

          <div
            style={{
              margin: "0% auto 3%",
              maxWidth: "60rem",
              padding: "0% 5% 0%"
            }}
          >
            <LetterProgressStepper
              currentLetterStatus={LETTER_PROGRESS.OFFICER_COMPLAINT_HISTORIES}
              pageChangeCallback={this.pageChangeCallback}
              caseId={this.state.caseId}
            />
            <div style={{ margin: "0 0 32px 0" }}>
              <Typography
                variant="h6"
                data-testid="complaint-history-page-header"
              >
                Officer Complaint History
              </Typography>
            </div>
            <LetterStatusMessage />

            {letterOfficers.length === 0
              ? this.renderNoOfficers()
              : this.renderOfficerHistories()}

            <div style={{ display: "flex" }}>
              <span style={{ flex: 1 }}>
                <SecondaryButton
                  onClick={this.saveAndGoBackToReview()}
                  data-testid="back-button"
                >
                  Back
                </SecondaryButton>
              </span>
              <span style={{ flex: 1, textAlign: "right" }}>
                <PrimaryButton
                  data-testid="next-button"
                  onClick={this.saveAndGoToNextPage()}
                >
                  Next
                </PrimaryButton>
              </span>
            </div>
            <RemoveOfficerHistoryNoteDialog
              removeNote={this.props.array.remove}
            />
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  accused: state.currentCase.details.accusedOfficers,
  allowAccusedOfficersToBeBlankFeature:
    state.featureToggles.allowAccusedOfficersToBeBlankFeature,
  letterDetails: state.referralLetter.letterDetails,
  initialValues: {
    letterOfficers: state.referralLetter.letterDetails.letterOfficers
  },
  caseReference: state.currentCase.details.caseReference
});

const mapDispatchToProps = {
  getCaseDetails,
  getReferralLetterData,
  getReferralLetterEditStatus,
  getMinimumCaseDetails
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: "OfficerHistories",
    enableReinitialize: true,
    destroyOnUnmount: false
  })(OfficerHistories)
);
