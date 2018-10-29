import React, { Component } from "react";
import { LETTER_PROGRESS } from "../../../../sharedUtilities/constants";
import NavBar from "../../../shared/components/NavBar/NavBar";
import { Card, CardContent, Typography } from "@material-ui/core";
import LinkButton from "../../../shared/components/LinkButton";
import LetterProgressStepper from "../LetterProgressStepper";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { SecondaryButton } from "../../../shared/components/StyledButtons";
import getLetterPreview from "../thunks/getLetterPreview";

class LetterPreview extends Component {
  constructor(props) {
    super(props);
    this.state = { caseId: this.props.match.params.id };
  }

  componentDidMount() {
    this.props.dispatch(getLetterPreview(this.state.caseId));
  }

  letterPreviewNotYetLoaded = () => {
    return this.props.letterHtml === "";
  };

  saveAndReturnToCase = () => {
    this.props.dispatch(push(`/cases/${this.state.caseId}`));
  };

  saveAndGoBackToRecommendedActions = () => {
    this.props.dispatch(
      push(`/cases/${this.state.caseId}/letter/recommended-actions`)
    );
  };

  displayLetterPreview = () => {
    return { __html: this.props.letterHtml };
  };

  render() {
    if (this.letterPreviewNotYetLoaded()) {
      return null;
    }

    return (
      <div>
        <NavBar>
          <Typography data-test="pageTitle" variant="title" color="inherit">
            {`Case #${this.state.caseId}   : Letter Generation`}
          </Typography>
        </NavBar>

        <LinkButton
          data-test="save-and-return-to-case-link"
          onClick={this.saveAndReturnToCase}
          style={{ margin: "2% 0% 2% 4%" }}
        >
          Back to Case
        </LinkButton>

        <div style={{ margin: "0% 5% 3%", width: "60%" }}>
          <LetterProgressStepper
            currentLetterStatus={LETTER_PROGRESS.PREVIEW}
          />
          <div style={{ margin: "0 0 32px 0" }}>
            <Typography
              style={{
                marginBottom: "24px"
              }}
              variant="title"
            >
              Preview
            </Typography>
            <Card
              style={{
                marginBottom: "24px",
                backgroundColor: "white",
                maxHeight: "875px",
                overflow: "auto"
              }}
            >
              <CardContent style={{ margin: "24px 48px 24px 48px" }}>
                <div
                  dangerouslySetInnerHTML={this.displayLetterPreview()}
                  className="letter-preview"
                />
              </CardContent>
            </Card>
            <SecondaryButton
              onClick={this.saveAndGoBackToRecommendedActions}
              data-test="back-button"
            >
              Back
            </SecondaryButton>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  letterHtml: state.referralLetter.letterHtml
});

export default connect(mapStateToProps)(LetterPreview);
