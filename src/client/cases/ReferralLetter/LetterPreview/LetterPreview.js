import React, { Component } from "react";
import {
  LETTER_PROGRESS,
  CASE_STATUS
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

  saveAndSubmitForApproval = updateCaseStatusCallback => {
    return this.props.handleSubmit(
      this.submitForm(null, updateCaseStatusCallback)
    );
  };

  submitForm = (redirectUrl, alternativeCallback) => (values, dispatch) => {
    dispatch(
      editReferralLetterAddresses(
        this.state.caseId,
        values,
        redirectUrl,
        alternativeCallback
      )
    );
  };

  confirmSubmitForApproval = values => {
    values.preventDefault();
    this.props.openCaseStatusUpdateDialog(`/cases/${this.state.caseId}`);
  };

  editLetterWithPossibleConfirmationDialog = () => {
    if (this.props.edited) {
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

  renderSubmitForApprovalButton = () => {
    if (this.props.caseDetail.status === CASE_STATUS.LETTER_IN_PROGRESS) {
      return (
        <PrimaryButton
          style={{ marginLeft: "16px" }}
          data-test="submit-for-approval-button"
          onClick={this.confirmSubmitForApproval}
        >
          Submit for Approval
        </PrimaryButton>
      );
    }
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

        <form>
          <LinkButton
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
                Preview
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
              <div style={{ display: "flex" }}>
                <span style={{ flex: 1 }}>
                  <SecondaryButton
                    onClick={this.saveAndGoBackToRecommendedActions()}
                    data-test="back-button"
                  >
                    Back
                  </SecondaryButton>
                </span>
                <span style={{ flex: 1, textAlign: "right" }}>
                  <SecondaryButton
                    data-test="edit-button"
                    onClick={this.editLetterWithPossibleConfirmationDialog()}
                  >
                    Edit
                  </SecondaryButton>
                  {this.renderSubmitForApprovalButton()}
                </span>
              </div>
            </div>
          </div>
        </form>
        <UpdateCaseStatusDialog
          alternativeAction={this.saveAndSubmitForApproval}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  letterHtml: state.referralLetter.letterHtml,
  initialValues: state.referralLetter.addresses,
  edited: state.referralLetter.edited,
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
