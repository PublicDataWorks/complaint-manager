import React, { Component } from "react";
import {
  CASE_STATUS,
  LETTER_PROGRESS
} from "../../../../sharedUtilities/constants";
import NavBar from "../../../shared/components/NavBar/NavBar";
import { Card, CardContent, Typography } from "@material-ui/core";
import LinkButton from "../../../shared/components/LinkButton";
import LetterProgressStepper from "../LetterProgressStepper";
import { connect } from "react-redux";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";
import getLetterPreview from "../thunks/getLetterPreview";
import { Field, reduxForm } from "redux-form";
import { TextField } from "redux-form-material-ui";
import editReferralLetterAddresses from "../thunks/editReferralLetterAddresses";
import { openEditLetterConfirmationDialog } from "../../../actionCreators/letterActionCreators";
import EditLetterConfirmationDialog from "./EditLetterConfirmationDialog";
import { openCaseStatusUpdateDialog } from "../../../actionCreators/casesActionCreators";
import UpdateCaseStatusDialog from "../../CaseDetails/UpdateCaseStatusDialog/UpdateCaseStatusDialog";
import { dateTimeFromString } from "../../../utilities/formatDate";
import generatePdf from "../thunks/generatePdf";

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
    return this.props.handleSubmit(
      this.submitForm(`/cases/${this.state.caseId}`)
    );
  };

  downloadLetterAsPdfFile = () => {
    this.props.dispatch(generatePdf(this.state.caseId));
  };

  saveAndGoBackToRecommendedActions = () => {
    return this.props.handleSubmit(
      this.submitForm(`/cases/${this.state.caseId}/letter/recommended-actions`)
    );
  };

  pageChangeCallback = redirectUrl => {
    return this.props.handleSubmit(this.submitForm(redirectUrl));
  };
  saveAndGoToEditLetter = () => {
    return this.props.handleSubmit(
      this.submitForm(`/cases/${this.state.caseId}/letter/edit-letter`)
    );
  };

  saveAndSubmitForReview = (
    updateCaseStatusSuccessCallback,
    updateCaseStatusFailureCallback
  ) => {
    return this.props.handleSubmit(
      this.submitForm(
        null,
        updateCaseStatusSuccessCallback,
        updateCaseStatusFailureCallback
      )
    );
  };

  submitForm = (
    redirectUrl,
    alternativeSuccessCallback,
    alternativeFailureCallback
  ) => (values, dispatch) => {
    dispatch(
      editReferralLetterAddresses(
        this.state.caseId,
        values,
        redirectUrl,
        alternativeSuccessCallback,
        alternativeFailureCallback
      )
    );
  };

  confirmSubmitForReview = values => {
    values.preventDefault();
    this.props.openCaseStatusUpdateDialog(`/cases/${this.state.caseId}`);
  };

  editLetterWithPossibleConfirmationDialog = () => {
    if (this.props.editHistory.edited) {
      return this.saveAndGoToEditLetter();
    } else {
      return () => {
        this.props.dispatch(openEditLetterConfirmationDialog());
      };
    }
  };

  displayLetterPreview = () => {
    return { __html: this.props.letterHtml };
  };

  renderSubmitForReviewButton = () => {
    if (this.props.caseDetail.status === CASE_STATUS.LETTER_IN_PROGRESS) {
      return (
        <PrimaryButton
          style={{ marginLeft: "16px" }}
          data-test="submit-for-review-button"
          onClick={this.confirmSubmitForReview}
        >
          Submit for Review
        </PrimaryButton>
      );
    }
  };

  timestampIfEdited() {
    if (this.props.editHistory.edited) {
      return (
        <i style={{ fontSize: "0.9rem", color: "black" }}>
          (Last edited {dateTimeFromString(this.props.editHistory.lastEdited)})
        </i>
      );
    }
    return null;
  }

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

        <form>
          <LinkButton
            data-test="save-and-return-to-case-link"
            data-test="save-and-return-to-case-link"
            onClick={this.saveAndReturnToCase()}
            style={{ margin: "2% 0% 2% 4%" }}
          >
            Back to Case
          </LinkButton>

          <div style={{ margin: "0% 5% 3%", width: "60%" }}>
            <LetterProgressStepper
              currentLetterStatus={LETTER_PROGRESS.PREVIEW}
              pageChangeCallback={this.pageChangeCallback}
              caseId={this.state.caseId}
            />
            <div style={{ margin: "0 0 32px 0" }}>
              <Typography
                style={{
                  marginBottom: "24px"
                }}
                variant="title"
              >
                Preview {this.timestampIfEdited()}
              </Typography>

              <Card
                style={{
                  marginBottom: "24px",
                  backgroundColor: "white",
                  overflow: "auto",
                  width: "22rem"
                }}
              >
                <CardContent>
                  <Field
                    style={{ flex: 4 }}
                    name="recipient"
                    component={TextField}
                    label="Address To"
                    fullWidth
                    multiline
                    rowsMax={5}
                  />
                </CardContent>
              </Card>
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
              <Card
                style={{
                  marginBottom: "24px",
                  backgroundColor: "white",
                  overflow: "auto",
                  width: "22rem"
                }}
              >
                <CardContent>
                  <Field
                    name="sender"
                    component={TextField}
                    label="Sincerely"
                    fullWidth
                    multiline
                    rowsMax={5}
                    style={{ marginBottom: "16px" }}
                  />

                  <Field
                    name="transcribedBy"
                    component={TextField}
                    label="Transcribed By"
                    fullWidth
                    inputProps={{ "data-test": "transcribed-by-field" }}
                  />
                </CardContent>
              </Card>
              <EditLetterConfirmationDialog
                caseId={this.state.caseId}
                saveAndGoToEditLetterCallback={this.saveAndGoToEditLetter()}
              />
              <LinkButton
                data-test="download-letter-as-pdf"
                onClick={this.downloadLetterAsPdfFile}
                style={{ marginBottom: "16px" }}
              >
                {this.props.editHistory.edited
                  ? "Download Edited Letter as PDF File"
                  : "Download Generated Letter as PDF File"}
              </LinkButton>
              <div style={{ display: "flex" }}>
                <span style={{ flex: "auto" }}>
                  <SecondaryButton
                    onClick={this.saveAndGoBackToRecommendedActions()}
                    data-test="back-button"
                  >
                    Back
                  </SecondaryButton>
                </span>
                <span style={{ flex: "auto", textAlign: "right" }}>
                  <SecondaryButton
                    data-test="edit-button"
                    onClick={this.editLetterWithPossibleConfirmationDialog()}
                  >
                    Edit Letter
                  </SecondaryButton>
                  {this.renderSubmitForReviewButton()}
                </span>
              </div>
            </div>
          </div>
        </form>
        <UpdateCaseStatusDialog
          alternativeAction={this.saveAndSubmitForReview}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  letterHtml: state.referralLetter.letterHtml,
  initialValues: state.referralLetter.addresses,
  editHistory: state.referralLetter.editHistory,
  caseDetail: state.currentCase.details
});

const mapDispatchToProps = {
  openCaseStatusUpdateDialog
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({ form: "LetterAddresses", enableReinitialize: true })(
    LetterPreview
  )
);
