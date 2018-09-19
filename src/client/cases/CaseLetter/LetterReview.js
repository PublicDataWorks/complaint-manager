import React, { Component } from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import NavBar from "../../shared/components/NavBar/NavBar";
import { connect } from "react-redux";
import * as _ from "lodash";
import getCaseDetails from "../thunks/getCaseDetails";
import { clearSelectedOfficer } from "../../actionCreators/officersActionCreators";
import { Link } from "react-router-dom";
import LinkButton from "../../shared/components/LinkButton";
import LetterProgressStepper from "./LetterProgressStepper";
import styles from "../../globalStyling/styles";
import CaseDetailCard from "./CaseDetailCard";
import {
  getAccusedOfficerData,
  getComplainantData,
  getIncidentInfoData,
  getWitnessData
} from "./CaseDetailDataHelpers";
import TextTruncate from "../../shared/components/TextTruncate";

export class LetterReview extends Component {
  caseDetailsNotYetLoaded() {
    return (
      _.isEmpty(this.props.caseDetail) ||
      `${this.props.caseDetail.id}` !== this.props.match.params.id
    );
  }

  componentDidMount() {
    this.props.dispatch(getCaseDetails(this.props.match.params.id));
  }

  render() {
    const { caseDetail } = this.props;
    const caseId = this.props.match.params.id;

    if (this.caseDetailsNotYetLoaded()) {
      return null;
    }

    return (
      <div>
        <NavBar>
          <Typography data-test="pageTitle" variant="title" color="inherit">
            {`Case #${caseId}   : Letter Generation`}
          </Typography>
        </NavBar>

        <LinkButton
          data-test="save-and-return-to-case-link"
          component={Link}
          to={`/cases/${caseId}`}
          style={{ margin: "2% 0% 2% 4%" }}
          onClick={() => this.props.dispatch(clearSelectedOfficer())}
        >
          Save and Return to Case
        </LinkButton>

        <LetterProgressStepper />

        <div style={{ margin: "0% 5% 3%" }}>
          <div style={{ margin: "0 0 32px 0" }}>
            <Typography variant="title">Review Case Details</Typography>
          </div>

          <CaseDetailCard
            cardTitle={"Incident Info"}
            cardData={getIncidentInfoData(caseDetail)}
          />

          <Card
            style={{
              backgroundColor: "white",
              width: "60%",
              margin: "0 0 32px 0"
            }}
          >
            <CardContent style={{ paddingBottom: "8px" }}>
              <Typography style={styles.section}>Narrative Summary</Typography>
              <Typography>{caseDetail.narrativeSummary}</Typography>
            </CardContent>
          </Card>

          <Card
            style={{
              backgroundColor: "white",
              width: "60%",
              margin: "0 0 32px 0"
            }}
          >
            <CardContent style={{ paddingBottom: "8px" }}>
              <Typography style={styles.section}>Narrative Details</Typography>
              <TextTruncate
                testLabel="letterReviewNarrativeDetails"
                message={
                  caseDetail.narrativeDetails
                    ? caseDetail.narrativeDetails
                    : "N/A"
                }
              />
            </CardContent>
          </Card>

          <CaseDetailCard
            cardTitle={"Complainant Information"}
            cardData={getComplainantData(caseDetail)}
          />

          <CaseDetailCard
            cardTitle={"Witness Information"}
            cardData={getWitnessData(caseDetail)}
          />

          {getAccusedOfficerData(caseDetail)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  caseDetail: state.currentCase.details,
  featureToggles: state.featureToggles
});

export default connect(mapStateToProps)(LetterReview);
