import React, { Component } from "react";
import NavBar from "../../../shared/components/NavBar/NavBar";
import { Card, CardContent, Typography } from "@material-ui/core";
import LinkButton from "../../../shared/components/LinkButton";
import LetterProgressStepper from "../LetterProgressStepper";
import { connect } from "react-redux";
import { LETTER_PROGRESS } from "../../../../sharedUtilities/constants";
import _ from "lodash";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import OfficerHistoryTabContent from "./OfficerHistoryTabContent";
import { FieldArray, reduxForm } from "redux-form";
import WarningMessage from "../../../shared/components/WarningMessage";
import RemoveOfficerHistoryNoteDialog from "./RemoveOfficerHistoryNoteDialog";
import getReferralLetter from "../thunks/getReferralLetter";
import { SecondaryButton } from "../../../shared/components/StyledButtons";
import editReferralLetter from "../thunks/editReferralLetter";
import { push } from "react-router-redux";

class OfficerHistories extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedTab: 0, caseId: this.props.match.params.id };
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

  submitForm = redirectUrl => (values, dispatch) => {
    if (values.referralLetterOfficers.length === 0) {
      dispatch(push(redirectUrl));
    } else {
      dispatch(editReferralLetter(this.state.caseId, values, redirectUrl));
    }
  };

  referralLetterNotYetLoaded() {
    return (
      _.isEmpty(this.props.letterDetails) ||
      `${this.props.letterDetails.caseId}` !== this.state.caseId
    );
  }

  componentDidMount() {
    this.props.dispatch(getReferralLetter(this.state.caseId));
  }

  handleTabChange = (event, selectedTab) => {
    this.setState({ selectedTab });
  };

  renderTabHeaders = () => {
    return this.props.letterDetails.referralLetterOfficers.map(
      letterOfficer => {
        return (
          <Tab
            key={letterOfficer.caseOfficerId}
            label={letterOfficer.fullName}
            data-test={`tab-${letterOfficer.caseOfficerId}`}
          />
        );
      }
    );
  };

  renderOfficerFields = ({ fields, selectedTab }) => {
    return fields.map((referralLetterOfficerField, index) => {
      const isSelectedOfficer = index === selectedTab;
      const letterOfficerInstance = fields.get(index);
      return (
        <OfficerHistoryTabContent
          referralLetterOfficer={referralLetterOfficerField}
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
        data-test="no-officers-message"
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
              scrollable
              scrollButtons="auto"
            >
              {this.renderTabHeaders()}
            </Tabs>
          </AppBar>
          <FieldArray
            name="referralLetterOfficers"
            component={this.renderOfficerFields}
            selectedTab={this.state.selectedTab}
          />
        </CardContent>
      </Card>
    );
  };

  render() {
    const letterOfficers = this.props.letterDetails.referralLetterOfficers;

    if (this.referralLetterNotYetLoaded()) {
      return null;
    }

    return (
      <div>
        <NavBar>
          <Typography data-test="pageTitle" variant="title" color="inherit">
            {`Case #${this.state.caseId}   : Letter Generation`}
          </Typography>
        </NavBar>

        <form>
          <LinkButton
            data-test="save-and-return-to-case-link"
            onClick={this.saveAndReturnToCase()}
            style={{ margin: "2% 0% 2% 4%" }}
          >
            Save and Return to Case
          </LinkButton>

          <div style={{ margin: "0% 5% 3%", width: "60%" }}>
            <LetterProgressStepper
              currentLetterStatus={LETTER_PROGRESS.OFFICER_COMPLAINT_HISTORIES}
            />
            <div style={{ margin: "0 0 32px 0" }}>
              <Typography variant="title">Officer Complaint History</Typography>
            </div>

            {letterOfficers.length === 0
              ? this.renderNoOfficers()
              : this.renderOfficerHistories()}

            <div>
              <SecondaryButton
                onClick={this.saveAndGoBackToReview()}
                data-test="back-button"
              >
                Back
              </SecondaryButton>
              <RemoveOfficerHistoryNoteDialog
                removeNote={this.props.array.remove}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  letterDetails: state.referralLetter.letterDetails,
  initialValues: {
    referralLetterOfficers:
      state.referralLetter.letterDetails.referralLetterOfficers
  }
});

export default connect(mapStateToProps)(
  reduxForm({ form: "OfficerHistories", enableReinitialize: true })(
    OfficerHistories
  )
);
