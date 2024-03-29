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
  mapOfficer,
  getAllegationData,
  getComplainantData,
  getIncidentInfoData,
  getWitnessData
} from "./CaseDetailDataHelpers";
import TextTruncate from "../../../shared/components/TextTruncate";
import { PrimaryButton } from "../../../shared/components/StyledButtons";
import {
  CASE_STATUSES_ALLOWED_TO_EDIT_LETTER,
  CONFIGS,
  LETTER_PROGRESS
} from "../../../../../sharedUtilities/constants";
import { push } from "connected-react-router";
import invalidCaseStatusRedirect from "../../thunks/invalidCaseStatusRedirect";
import LetterStatusMessage from "../../CaseDetails/LetterStatusMessage/LetterStatusMessage";
import getReferralLetterEditStatus from "../thunks/getReferralLetterEditStatus";
import { policeDataManagerMenuOptions } from "../../../shared/components/NavBar/policeDataManagerMenuOptions";

export class LetterReview extends Component {
  caseDetailsNotYetLoaded() {
    return (
      _.isEmpty(this.props.caseDetails) ||
      `${this.props.caseDetails.id}` !== this.props.match.params.id
    );
  }

  componentDidMount() {
    const caseId = this.props.match.params.id;
    this.props.getCaseDetails(caseId);
    this.props.getReferralLetterEditStatus(caseId);
  }

  componentDidUpdate() {
    if (!this.caseDetailsNotYetLoaded() && !this.statusIsAllowed()) {
      const caseId = this.props.caseDetails.id;
      this.props.invalidCaseStatusRedirect(caseId);
    }
  }

  statusIsAllowed = () => {
    return (
      CASE_STATUSES_ALLOWED_TO_EDIT_LETTER.includes(
        this.props.caseDetails.status
      ) && !this.props.caseDetails.isArchived
    );
  };

  pageChangeCallback = redirectUrl => () => {
    this.props.push(redirectUrl);
  };

  narrativeDetailsData = cardData => {
    const regex = /(<([^>]+)>)/gi;
    const strippedNarrDetails = cardData.props.message.replace(regex, "");
    return strippedNarrDetails;
  };

  render() {
    const { caseDetails, organization, pd } = this.props;
    const caseId = this.props.match.params.id;

    if (this.caseDetailsNotYetLoaded() || !this.statusIsAllowed()) {
      return null;
    }

    const narrativeSummaryCardData = caseDetails.narrativeSummary ? (
      <Typography>{caseDetails.narrativeSummary}</Typography>
    ) : (
      <Typography style={{ fontStyle: "italic", color: "grey" }}>
        Not specified
      </Typography>
    );

    const narrativeDetailsCardData = (
      <TextTruncate
        testLabel="letterReviewNarrativeDetails"
        message={caseDetails.narrativeDetails}
      />
    );

    let nextPath;
    if (
      this.props.allowAccusedOfficersToBeBlankFeature &&
      this.props.accused.length === 0
    ) {
      nextPath = `/cases/${caseId}/letter/letter-preview`;
    } else {
      nextPath = `/cases/${caseId}/letter/officer-history`;
    }

    return (
      <div>
        <NavBar menuType={policeDataManagerMenuOptions}>
          {`Case #${this.props.caseDetails.caseReference}   : Letter Generation`}
        </NavBar>

        <LinkButton
          data-testid="return-to-case-link"
          component={Link}
          to={`/cases/${caseId}`}
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
            currentLetterStatus={LETTER_PROGRESS.REVIEW_CASE_DETAILS}
            pageChangeCallback={this.pageChangeCallback}
            caseId={caseId}
          />

          <div style={{ margin: "0 0 32px 0" }}>
            <Typography variant="h6" data-testid="letter-review-page-header">
              Review Case Details
            </Typography>
          </div>
          <LetterStatusMessage />

          <CaseDetailCard
            cardTitle={"Incident Info"}
            cardData={getIncidentInfoData(caseDetails, organization)}
          />

          <CaseDetailCard
            cardTitle={"Narrative Summary"}
            cardData={narrativeSummaryCardData}
            cardSecondTitle={"Narrative Details"}
            narrativeDetailsCardData={narrativeDetailsCardData}
          />

          <CaseDetailCard
            cardTitle={"Complainant Information"}
            cardData={getComplainantData(caseDetails, pd)}
          />

          <CaseDetailCard
            cardTitle={"Witness Information"}
            cardData={getWitnessData(caseDetails, pd)}
          />

          {caseDetails.accusedOfficers.map(officer => {
            const cardTitle = officer.caseEmployeeType.includes("Civilian")
              ? `Accused Civilian (${pd})`
              : "Accused Officer";
            return (
              <CaseDetailCard
                cardTitle={cardTitle}
                cardData={[mapOfficer(officer, pd)]}
                data-testid="case-detail-card-accused"
                cardSecondTitle={"Allegations"}
                allegations={getAllegationData(officer)}
                key={officer.id}
              />
            );
          })}
          <div style={{ textAlign: "right" }}>
            <PrimaryButton
              data-testid="next-button"
              component={Link}
              to={nextPath}
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
  getReferralLetterEditStatus,
  push
};

const mapStateToProps = state => ({
  caseDetails: state.currentCase.details,
  organization: state.configs[CONFIGS.ORGANIZATION],
  pd: state.configs[CONFIGS.PD],
  allowAccusedOfficersToBeBlankFeature:
    state.featureToggles.allowAccusedOfficersToBeBlankFeature,
  accused: state.currentCase.details.accusedOfficers
});

export default connect(mapStateToProps, mapDispatchToProps)(LetterReview);
