import React, { Component } from "react";
import {
  CASE_STATUS,
  LETTER_PROGRESS,
  EDIT_STATUS,
  USER_PERMISSIONS,
  UNKNOWN_OFFICER_NAME
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
import getReferralLetterPreview from "../thunks/getReferralLetterPreview";
import { Field, reduxForm } from "redux-form";
import { TextField } from "redux-form-material-ui";
import editReferralLetterAddresses from "../thunks/editReferralLetterAddresses";
import {
  openEditLetterConfirmationDialog,
  openIncompleteOfficerHistoryDialog,
  startLetterDownload,
  stopLetterDownload
} from "../../../actionCreators/letterActionCreators";
import EditLetterConfirmationDialog from "./EditLetterConfirmationDialog";
import { openCaseStatusUpdateDialog } from "../../../actionCreators/casesActionCreators";
import UpdateCaseStatusDialog from "../../CaseDetails/UpdateCaseStatusDialog/UpdateCaseStatusDialog";
import { dateTimeFromString } from "../../../utilities/formatDate";
import getReferralLetterPdf from "../thunks/getReferralLetterPdf";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import styles from "../../../globalStyling/styles";
import getReferralLetterData from "../thunks/getReferralLetterData";
import IncompleteOfficerHistoryDialog from "../../sharedFormComponents/IncompleteOfficerHistoryDialog";

class LetterPreview extends Component {
  constructor(props) {
    super(props);
    this.state = { caseId: this.props.match.params.id };
  }

  componentDidMount() {
    this.props.getReferralLetterPreview(this.state.caseId);
    this.props.getReferralLetterData(this.state.caseId);
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
    return this.props.dispatch(
      getReferralLetterPdf(this.state.caseId, this.props.draftFilename, true)
    );
  };

  saveAndDownloadPdf = () => {
    this.props.startLetterDownload();
    this.props.handleSubmit(
      this.submitForm(
        null,
        this.downloadLetterAsPdfFile,
        this.props.stopLetterDownload
      )
    )();
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

  saveAndGoToReviewAndApproveLetter = () => {
    return this.props.handleSubmit(
      this.submitForm(`/cases/${this.state.caseId}/letter/review-and-approve`)
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
    if (!this.props.letterOfficers) {
      this.props.openIncompleteOfficerHistoryDialog();
      return;
    }
    for (let i = 0; i < this.props.letterOfficers.length; i++) {
      if (
        this.props.letterOfficers[i].fullName !== UNKNOWN_OFFICER_NAME &&
        !this.props.letterOfficers[i].officerHistoryOptionId
      ) {
        this.props.openIncompleteOfficerHistoryDialog(i);
        return;
      }
    }
    this.props.openCaseStatusUpdateDialog(
      this.props.caseDetails.nextStatus,
      `/cases/${this.state.caseId}`
    );
  };

  editLetterWithPossibleConfirmationDialog = () => {
    if (this.props.editStatus === EDIT_STATUS.EDITED) {
      return this.saveAndGoToEditLetter();
    } else {
      return () => {
        this.props.dispatch(openEditLetterConfirmationDialog());
      };
    }
  };

  renderEditLetterButton = () => {
    if (this.letterAlreadyApproved()) {
      return null;
    }
    return (
      <SecondaryButton
        data-test="edit-confirmation-dialog-button"
        onClick={this.editLetterWithPossibleConfirmationDialog()}
      >
        Edit Letter
      </SecondaryButton>
    );
  };

  displayLetterPreview = () => {
    return { __html: this.props.letterHtml };
  };

  renderSubmitForReviewButton = () => {
    if (this.props.caseDetails.status === CASE_STATUS.LETTER_IN_PROGRESS) {
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

  letterAlreadyApproved = () => {
    return ![
      CASE_STATUS.LETTER_IN_PROGRESS,
      CASE_STATUS.READY_FOR_REVIEW
    ].includes(this.props.caseDetails.status);
  };

  renderLetterPreview = () => {
    if (!this.props.caseDetails.status) {
      return null;
    }
    if (this.letterAlreadyApproved()) {
      return (
        <div
          style={{ marginBottom: "24px" }}
          data-test="letter-preview-approved-message"
        >
          <i>This letter has already been approved.</i>
        </div>
      );
    }
    return (
      <div data-test="letter-preview">
        <Card
          style={{
            marginBottom: "24px",
            backgroundColor: "white",
            overflow: "auto",
            width: "23rem"
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
            maxHeight: "55rem",
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
              inputProps={{
                "data-test": "transcribed-by-field",
                maxLength: 255
              }}
            />
          </CardContent>
        </Card>
        <EditLetterConfirmationDialog
          caseId={this.state.caseId}
          saveAndGoToEditLetterCallback={this.saveAndGoToEditLetter()}
        />
        <LinkButton
          data-test="download-letter-as-pdf"
          onClick={this.saveAndDownloadPdf}
          style={{ marginBottom: "16px" }}
          disabled={this.props.downloadInProgress}
        >
          {this.props.editStatus === EDIT_STATUS.EDITED
            ? "Download Edited Letter as PDF File"
            : "Download Generated Letter as PDF File"}
        </LinkButton>

        <CircularProgress
          data-test={"download-letter-progress"}
          size={25}
          style={{ display: this.props.downloadInProgress ? "" : "none" }}
        />
      </div>
    );
  };

  renderReviewAndApproveButton = () => {
    if (
      this.props.caseDetails.status === CASE_STATUS.READY_FOR_REVIEW &&
      this.props.userInfo &&
      this.props.userInfo.permissions.includes(
        USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES
      )
    ) {
      return (
        <PrimaryButton
          style={{ marginLeft: "16px" }}
          data-test="review-and-approve-letter-button"
          onClick={this.saveAndGoToReviewAndApproveLetter()}
        >
          Review and Approve Letter
        </PrimaryButton>
      );
    }
  };

  timestampIfEdited() {
    if (this.props.editStatus === EDIT_STATUS.EDITED) {
      return (
        <i style={styles.body1}>
          (Last edited {dateTimeFromString(this.props.lastEdited)})
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
            {`Case #${
              this.props.caseDetails.caseReference
            }   : Letter Generation`}
          </Typography>
        </NavBar>

        <form>
          <LinkButton
            data-test="save-and-return-to-case-link"
            onClick={this.saveAndReturnToCase()}
            style={{ margin: "2% 0% 2% 4%" }}
          >
            Back to Case
          </LinkButton>

          <div style={{ margin: "0% 5% 3%", maxWidth: "60rem" }}>
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
                data-test="preview-page-header"
              >
                Preview {this.timestampIfEdited()}
              </Typography>
              {this.renderLetterPreview()}
              {!this.props.caseDetails.status ? null : (
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
                    {this.renderEditLetterButton()}
                    {this.renderReviewAndApproveButton()}
                    {this.renderSubmitForReviewButton()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </form>
        <IncompleteOfficerHistoryDialog caseId={this.state.caseId} />
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
  editStatus: state.referralLetter.editStatus,
  lastEdited: state.referralLetter.lastEdited,
  draftFilename: state.referralLetter.draftFilename,
  caseDetails: state.currentCase.details,
  downloadInProgress: state.ui.letterDownload.downloadInProgress,
  userInfo: state.users.current.userInfo,
  letterOfficers: state.referralLetter.letterDetails.letterOfficers
});

const mapDispatchToProps = {
  openCaseStatusUpdateDialog,
  startLetterDownload,
  stopLetterDownload,
  getReferralLetterData,
  getReferralLetterPreview,
  openIncompleteOfficerHistoryDialog
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({ form: "LetterAddresses", enableReinitialize: true })(
    LetterPreview
  )
);
