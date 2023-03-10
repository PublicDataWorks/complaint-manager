import React, { Component } from "react";
import axios from "axios";
import { push } from "connected-react-router";
import {
  EDIT_STATUS,
  LETTER_PROGRESS,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import NavBar from "../../../shared/components/NavBar/NavBar";
import { Card, CardContent, Typography } from "@material-ui/core";
import LinkButton from "../../../shared/components/LinkButton";
import LetterProgressStepper from "../LetterProgressStepper";
import { connect } from "react-redux";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";
import { Field, reduxForm } from "redux-form";
import {
  openEditLetterConfirmationDialog,
  openIncompleteClassificationsDialog,
  openIncompleteOfficerHistoryDialog,
  openMissingComplainantDialog,
  startLetterDownload,
  stopLetterDownload
} from "../../../actionCreators/letterActionCreators";
import EditLetterConfirmationDialog from "./EditLetterConfirmationDialog";
import { openCaseStatusUpdateDialog } from "../../../actionCreators/casesActionCreators";
import UpdateCaseStatusDialog from "../../CaseDetails/UpdateCaseStatusDialog/UpdateCaseStatusDialog";
import { dateTimeFromString } from "../../../../../sharedUtilities/formatDate";
import getLetterPdf from "../thunks/getLetterPdf";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import styles from "../../../../common/globalStyling/styles";
import IncompleteOfficerHistoryDialog from "../../sharedFormComponents/IncompleteOfficerHistoryDialog";
import { policeDataManagerMenuOptions } from "../../../shared/components/NavBar/policeDataManagerMenuOptions";
import IncompleteClassificationsDialog from "../../sharedFormComponents/IncompleteClassificationsDialog";
import MissingComplainantDialog from "../../sharedFormComponents/MissingComplainantDialog";
import validateLetterDetails from "../../../utilities/validateLetterDetails";
import { renderTextField } from "../../sharedFormComponents/renderFunctions";
import { userTimezone } from "../../../../common/helpers/userTimezone";
import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";

export const SUBMIT_BUTTON_TYPE = {
  SUBMIT_FOR_REVIEW_BTN: "submitForReview",
  REVIEW_AND_APPROVE_BTN: "reviewAndApprove",
  GENERATE_LETTER_BTN: "generate"
};

export class LetterPreview extends Component {
  constructor(props) {
    super(props);
  }

  letterPreviewNotYetLoaded = () => {
    return this.props.letterHtml === "";
  };

  saveAndReturnToCase = () => {
    return this.props.handleSubmit(
      this.submitForm(`/cases/${this.props.caseId}`)
    );
  };

  downloadLetterAsPdfFile = () => {
    return this.props.dispatch(
      getLetterPdf(
        this.props.caseId,
        this.props.draftFilename,
        true,
        this.props.getPdfEndpoint
      )
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
      this.submitForm(`/cases/${this.props.caseId}/letter/recommended-actions`)
    );
  };

  pageChangeCallback = redirectUrl => {
    return this.props.handleSubmit(this.submitForm(redirectUrl));
  };

  saveAndGoToEditLetter = () => {
    return this.props.handleSubmit(
      this.submitForm(
        `/cases/${this.props.caseId}/${this.props.editLetterEndpoint}`
      )
    );
  };

  saveAndGoToReviewAndApproveLetter = values => {
    values.preventDefault();
    const isLetterValid = validateLetterDetails(this.props);

    if (isLetterValid) {
      return this.props.handleSubmit(
        this.submitForm(`/cases/${this.props.caseId}/letter/review-and-approve`)
      )(values, this.props.dispatch);
    }
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

  submitForm =
    (redirectUrl, alternativeSuccessCallback, alternativeFailureCallback) =>
    values => {
      axios
        .put(this.props.editAddressUrl, values)
        .then(() => {
          if (alternativeSuccessCallback) {
            alternativeSuccessCallback();
          } else {
            this.props.push(redirectUrl);
          }
          this.props.snackbarSuccess("Letter was successfully updated");
        })
        .catch(() => {
          if (alternativeFailureCallback) {
            alternativeFailureCallback();
          }
        });
    };

  confirmSubmitForReview = async values => {
    values.preventDefault();
    const isLetterValid = await validateLetterDetails(this.props);
    if (isLetterValid) {
      this.props.openCaseStatusUpdateDialog(
        this.props.caseDetails.nextStatus,
        `/cases/${this.props.caseId}`
      );
    }
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
    if (
      this.props.letterAlreadyApproved(this.props.caseDetails.status) ||
      !this.props.permissions?.includes(USER_PERMISSIONS.SETUP_LETTER)
    ) {
      return null;
    }
    return (
      <SecondaryButton
        data-testid="edit-confirmation-dialog-button"
        onClick={this.editLetterWithPossibleConfirmationDialog()}
      >
        Edit Letter
      </SecondaryButton>
    );
  };

  displayLetterPreview = () => {
    return { __html: this.props.letterHtml };
  };

  renderLetterPreview = () => {
    if (!this.props.caseDetails.status) {
      return null;
    }
    if (this.props.letterAlreadyApproved(this.props.caseDetails.status)) {
      return (
        <div
          style={{ marginBottom: "24px" }}
          data-testid="letter-preview-approved-message"
        >
          <i>This letter has already been approved.</i>
        </div>
      );
    }
    return (
      <div data-testid="letter-preview">
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
              style={{ flex: 4, marginBottom: "16px" }}
              name="recipient"
              component={renderTextField}
              label="Title and Name"
              fullWidth
              multiline
              maxRows={5}
              inputProps={{
                autoComplete: "off",
                "data-testid": "recipient-field"
              }}
            />
            <Field
              style={{ flex: 4 }}
              name="recipientAddress"
              component={renderTextField}
              label="Address To"
              fullWidth
              multiline
              maxRows={5}
              inputProps={{
                autoComplete: "off",
                "data-testid": "recipient-address-field"
              }}
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
              component={renderTextField}
              label="Sincerely"
              fullWidth
              multiline
              maxRows={5}
              style={{ marginBottom: "16px" }}
              inputProps={{
                autoComplete: "off",
                "data-testid": "sender-field"
              }}
            />

            <Field
              name="transcribedBy"
              component={renderTextField}
              label="Transcribed By"
              fullWidth
              inputProps={{
                "data-testid": "transcribed-by-field",
                maxLength: 255,
                autoComplete: "off"
              }}
            />
          </CardContent>
        </Card>
        <EditLetterConfirmationDialog
          caseId={this.props.caseId}
          saveAndGoToEditLetterCallback={this.saveAndGoToEditLetter()}
        />
        <LinkButton
          data-testid="download-letter-as-pdf"
          onClick={this.saveAndDownloadPdf}
          style={{ marginBottom: "16px" }}
          disabled={this.props.downloadInProgress}
        >
          {this.props.editStatus === EDIT_STATUS.EDITED
            ? "Download Edited Letter as PDF File"
            : "Download Generated Letter as PDF File"}
        </LinkButton>

        <CircularProgress
          data-testid={"download-letter-progress"}
          size={25}
          style={{ display: this.props.downloadInProgress ? "" : "none" }}
        />
      </div>
    );
  };

  renderReviewAndApproveButton = () => (
    <PrimaryButton
      style={{ marginLeft: "16px" }}
      data-testid="review-and-approve-letter-button"
      onClick={this.saveAndGoToReviewAndApproveLetter.bind(this)}
    >
      Review and Approve Letter
    </PrimaryButton>
  );

  renderSubmitForReviewButton = () => (
    <PrimaryButton
      style={{ marginLeft: "16px" }}
      data-testid="submit-for-review-button"
      onClick={this.confirmSubmitForReview}
    >
      Submit for Review
    </PrimaryButton>
  );

  renderGenerateLetterButton = () => (
    <PrimaryButton
      style={{ marginLeft: "16px" }}
      data-testid="generate-letter-button"
      onClick={this.props.handleSubmit(
        this.submitForm(null, this.props.generateEditedLetter)
      )}
    >
      Generate Letter
    </PrimaryButton>
  );

  renderSubmitButton = () => {
    switch (this.props.submitButtonType) {
      case SUBMIT_BUTTON_TYPE.REVIEW_AND_APPROVE_BTN:
        return this.renderReviewAndApproveButton();
      case SUBMIT_BUTTON_TYPE.SUBMIT_FOR_REVIEW_BTN:
        return this.renderSubmitForReviewButton();
      case SUBMIT_BUTTON_TYPE.GENERATE_LETTER_BTN:
        return this.renderGenerateLetterButton();
      default:
        return "";
    }
  };

  timestampIfEdited() {
    if (this.props.editStatus === EDIT_STATUS.EDITED) {
      return (
        <i style={styles.body1}>
          (Last edited {dateTimeFromString(this.props.lastEdited, userTimezone)}
          )
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
        <NavBar menuType={policeDataManagerMenuOptions}>
          {`Case #${this.props.caseDetails.caseReference}   : Letter Generation`}
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
            {this.props.useLetterProgressStepper ? (
              <LetterProgressStepper
                currentLetterStatus={LETTER_PROGRESS.PREVIEW}
                pageChangeCallback={this.pageChangeCallback}
                caseId={this.props.caseId}
              />
            ) : null}
            <div style={{ margin: "0 0 32px 0" }}>
              <Typography
                style={{
                  marginBottom: "24px"
                }}
                variant="h6"
                data-testid="preview-page-header"
              >
                Preview {this.timestampIfEdited()}
              </Typography>
              {this.renderLetterPreview()}
              {!this.props.caseDetails.status ? null : (
                <div style={{ display: "flex" }}>
                  <span style={{ flex: "auto" }}>
                    <SecondaryButton
                      onClick={this.saveAndGoBackToRecommendedActions()}
                      data-testid="back-button"
                    >
                      Back
                    </SecondaryButton>
                  </span>
                  <span style={{ flex: "auto", textAlign: "right" }}>
                    {this.renderEditLetterButton()}
                    {this.renderSubmitButton()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </form>
        <MissingComplainantDialog caseId={this.props.caseId} />
        <IncompleteOfficerHistoryDialog caseId={this.props.caseId} />
        <IncompleteClassificationsDialog caseId={this.props.caseId} />
        <UpdateCaseStatusDialog
          alternativeAction={this.saveAndSubmitForReview}
        />
      </div>
    );
  }
}

LetterPreview.defaultProps = {
  letterAlreadyApproved: () => false
};

const mapStateToProps = (state, props) => ({
  accused: state.currentCase.details.accusedOfficers,
  allowAccusedOfficersToBeBlankFeature:
    state.featureToggles.allowAccusedOfficersToBeBlankFeature,
  caseDetails: state.currentCase.details,
  classificationFeature: state.featureToggles.classificationFeature,
  classifications: state.referralLetter.letterDetails.classifications,
  downloadInProgress: state.ui.letterDownload.downloadInProgress,
  initialValues: props.addresses,
  permissions: state.users?.current?.userInfo?.permissions,
  userInfo: state.users.current.userInfo
});

const mapDispatchToProps = {
  openCaseStatusUpdateDialog,
  openIncompleteClassificationsDialog,
  openIncompleteOfficerHistoryDialog,
  openMissingComplainantDialog,
  push,
  snackbarSuccess,
  startLetterDownload,
  stopLetterDownload
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({ form: "LetterAddresses", enableReinitialize: true })(
    LetterPreview
  )
);
