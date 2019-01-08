import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import NavBar from "../../../shared/components/NavBar/NavBar";
import { connect } from "react-redux";
import * as _ from "lodash";
import getCaseDetails from "../../thunks/getCaseDetails";
import { Link } from "react-router-dom";
import LinkButton from "../../../shared/components/LinkButton";
import LetterProgressStepper from "../LetterProgressStepper";
import CaseDetailCard from "./CaseDetailCard";
import {
  getAccusedOfficerData,
  getAllegationData,
  getComplainantData,
  getIncidentInfoData,
  getWitnessData
} from "./CaseDetailDataHelpers";
import TextTruncate from "../../../shared/components/TextTruncate";
import { PrimaryButton } from "../../../shared/components/StyledButtons";
import {
  CASE_STATUSES_ALLOWED_TO_EDIT_LETTER,
  LETTER_PROGRESS
} from "../../../../sharedUtilities/constants";
import { push } from "react-router-redux";
import invalidCaseStatusRedirect from "../../thunks/invalidCaseStatusRedirect";
import EditLetterStatusMessage from "../../CaseDetails/EditLetterStatusMessage/EditLetterStatusMessage";
import getLetterType from "../thunks/getLetterType";

export class LetterReview extends Component {
  caseDetailsNotYetLoaded() {
    return (
      _.isEmpty(this.props.caseDetail) ||
      `${this.props.caseDetail.id}` !== this.props.match.params.id
    );
  }

  componentDidMount() {
    const caseId = this.props.match.params.id;
    this.props.getCaseDetails(caseId);
    this.props.getLetterType(caseId);
  }

  componentDidUpdate() {
    if (!this.caseDetailsNotYetLoaded() && !this.statusIsAllowed()) {
      const caseId = this.props.caseDetail.id;
      this.props.invalidCaseStatusRedirect(caseId);
    }
  }

  statusIsAllowed = () => {
    return CASE_STATUSES_ALLOWED_TO_EDIT_LETTER.includes(
      this.props.caseDetail.status
    );
  };

  pageChangeCallback = redirectUrl => () => {
    this.props.push(redirectUrl);
  };

  render() {
    const { caseDetail } = this.props;
    const caseId = this.props.match.params.id;

    if (this.caseDetailsNotYetLoaded() || !this.statusIsAllowed()) {
      return null;
    }

    const narrativeSummaryCardData = caseDetail.narrativeSummary ? (
      <Typography>{caseDetail.narrativeSummary}</Typography>
    ) : (
      <Typography style={{ fontStyle: "italic", color: "grey" }}>
        Not specified
      </Typography>
    );

    const narrativeDetailsCardData = caseDetail.narrativeDetails ? (
      <TextTruncate
        testLabel="letterReviewNarrativeDetails"
        message={caseDetail.narrativeDetails}
      />
    ) : (
      <Typography style={{ fontStyle: "italic", color: "grey" }}>
        Not specified
      </Typography>
    );

    return (
      <div>
        <NavBar>
          <Typography data-test="pageTitle" variant="title" color="inherit">
            {`Case #${this.props.caseDetail.caseNumber}   : Letter Generation`}
          </Typography>
        </NavBar>

        <LinkButton
          data-test="return-to-case-link"
          component={Link}
          to={`/cases/${caseId}`}
          style={{ margin: "2% 0% 2% 4%" }}
        >
          Back to Case
        </LinkButton>

        <div style={{ margin: "0% 5% 3%", maxWidth: "60rem" }}>
          <LetterProgressStepper
            currentLetterStatus={LETTER_PROGRESS.REVIEW_CASE_DETAILS}
            pageChangeCallback={this.pageChangeCallback}
            caseId={caseId}
          />

          <div style={{ margin: "0 0 32px 0" }}>
            <Typography variant="title" data-test="letter-review-page-header">
              Review Case Details
            </Typography>
          </div>
          <EditLetterStatusMessage />

          <CaseDetailCard
            cardTitle={"Incident Info"}
            cardData={getIncidentInfoData(caseDetail)}
          />

          <CaseDetailCard
            cardTitle={"Narrative Summary"}
            cardData={narrativeSummaryCardData}
          />

          <CaseDetailCard
            cardTitle={"Narrative Details"}
            cardData={narrativeDetailsCardData}
          />

          <CaseDetailCard
            cardTitle={"Complainant Information"}
            cardData={getComplainantData(caseDetail)}
          />

          <CaseDetailCard
            cardTitle={"Witness Information"}
            cardData={getWitnessData(caseDetail)}
          />

          {caseDetail.accusedOfficers.map(officer => {
            return (
              <CaseDetailCard
                cardTitle={"Accused Officer"}
                cardData={getAccusedOfficerData(officer)}
                cardSecondTitle={"Allegations"}
                allegations={getAllegationData(officer)}
                key={officer.id}
              />
            );
          })}
          <div style={{ textAlign: "right" }}>
            <PrimaryButton
              data-test="next-button"
              component={Link}
              to={`/cases/${caseId}/letter/officer-history`}
            >
              Next
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  getCaseDetails,
  invalidCaseStatusRedirect,
  getLetterType,
  push
};

const mapStateToProps = state => ({
  caseDetail: state.currentCase.details
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LetterReview);
