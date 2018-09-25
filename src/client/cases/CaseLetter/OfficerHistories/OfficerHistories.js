import React, { Component } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../../shared/components/NavBar/NavBar";
import { Typography } from "@material-ui/core";
import LinkButton from "../../../shared/components/LinkButton";
import LetterProgressStepper from "../LetterProgressStepper";
import getCaseDetails from "../../thunks/getCaseDetails";
import { connect } from "react-redux";
import { LETTER_PROGRESS } from "../../../../sharedUtilities/constants";
import _ from "lodash";

export class OfficerHistories extends Component {
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
          data-test="return-to-case-link"
          component={Link}
          to={`/cases/${caseId}`}
          style={{ margin: "2% 0% 2% 4%" }}
        >
          Return to Case
        </LinkButton>
        <LetterProgressStepper
          currentLetterStatus={LETTER_PROGRESS.OFFICER_COMPLAINT_HISTORIES}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  caseDetail: state.currentCase.details
});

export default connect(mapStateToProps)(OfficerHistories);
