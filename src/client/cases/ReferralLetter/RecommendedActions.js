import getReferralLetter from "./thunks/getReferralLetter";
import _ from "lodash";
import { LETTER_PROGRESS } from "../../../sharedUtilities/constants";
import NavBar from "../../shared/components/NavBar/NavBar";
import { Card, CardContent, Typography } from "@material-ui/core";
import LinkButton from "../../shared/components/LinkButton";
import LetterProgressStepper from "./LetterProgressStepper";
import React, { Component } from "react";
import { reduxForm } from "redux-form";
import { connect } from "react-redux";

class RecommendedActions extends Component {
  constructor(props) {
    super(props);
    this.state = { caseId: this.props.match.params.id };
  }

  componentDidMount() {
    this.props.dispatch(getReferralLetter(this.state.caseId));
  }

  referralLetterNotYetLoaded = () => {
    return (
      _.isEmpty(this.props.letterDetails) ||
      `${this.props.letterDetails.caseId}` !== this.state.caseId
    );
  };

  render() {
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
            onClick={() => {}}
            style={{ margin: "2% 0% 2% 4%" }}
          >
            Save and Return to Case
          </LinkButton>

          <div style={{ margin: "0% 5% 3%", width: "60%" }}>
            <LetterProgressStepper
              currentLetterStatus={LETTER_PROGRESS.RECOMMENDED_ACTIONS}
            />
            <div style={{ margin: "0 0 32px 0" }}>
              <Typography variant="title">Recommended Actions</Typography>
            </div>
            <div style={{ marginBottom: "32px" }} />
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  letterDetails: state.referralLetter.letterDetails,
  initialValues: {
    includeRetaliationConcerns:
      state.referralLetter.letterDetails.includeRetaliationConcerns,
    referralLetterOfficers:
      state.referralLetter.letterDetails.referralLetterOfficers
  }
});

export default connect(mapStateToProps)(
  reduxForm({ form: "RecommendedActions", enableReinitialize: true })(
    RecommendedActions
  )
);
