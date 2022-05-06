import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography } from "@material-ui/core";
import NavBar from "../../../shared/components/NavBar/NavBar";
import { connect } from "react-redux";
import LinkButton from "../../../shared/components/LinkButton";
import LetterProgressStepper from "../LetterProgressStepper";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";
import {
  CASE_STATUS,
  EDIT_LETTER_HTML_FORM,
  LETTER_PROGRESS
} from "../../../../../sharedUtilities/constants";
import getReferralLetterPreview from "../thunks/getReferralLetterPreview";
import { Field, initialize, reduxForm, reset } from "redux-form";
import RichTextEditor from "../../../shared/components/RichTextEditor/RichTextEditor";
import { openCancelEditLetterConfirmationDialog } from "../../../actionCreators/letterActionCreators";
import CancelEditLetterConfirmationDialog from "./CancelEditLetterConfirmationDialog";
import editReferralLetterContent from "../thunks/editReferralLetterContent";
import invalidCaseStatusRedirect from "../../thunks/invalidCaseStatusRedirect";
import { policeDataManagerMenuOptions } from "../../../shared/components/NavBar/policeDataManagerMenuOptions";
import history from "../../../../history";
import { push } from "connected-react-router";

const RichTextEditorComponent = props => {
  return (
    <RichTextEditor
      initialValue={props.input.value}
      onChange={newValue => props.input.onChange(newValue)}
      data-testid={"editLetterInput"}
      initializeForm={(dispatch, value) => {
        dispatch(
          initialize(EDIT_LETTER_HTML_FORM, { editedLetterHtml: value })
        );
      }}
    />
  );
};

let shouldBlockRoutingRedirects;

export class EditLetter extends Component {
  constructor(props) {
    super(props);
    this.state = { caseId: this.props.match.params.id, redirectUrl: null };
  }

  componentDidMount() {
    shouldBlockRoutingRedirects = shouldNotRedirect => {
      history.block(location => {
        if (
          location.pathname !==
            `cases/${this.state.caseId}/letter/edit-letter` &&
          this.props.dirty &&
          shouldNotRedirect
        ) {
          this.setState({ redirectUrl: location.pathname });
          this.props.dispatch(openCancelEditLetterConfirmationDialog());
          return false;
        }
      });
    };
    shouldBlockRoutingRedirects(true);
    this.props.dispatch(getReferralLetterPreview(this.state.caseId));

    if (this.props.initialValues.editedLetterHtml === "") {
      this.props.dispatch(
        initialize(EDIT_LETTER_HTML_FORM, this.state.initialValues)
      );
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.letterPreviewNotYetLoaded() && this.invalidCaseStatus()) {
      this.props.invalidCaseStatusRedirect(this.state.caseId);
    }
  }

  invalidCaseStatus = () => {
    const allowed_statuses_for_edit_letter = [
      CASE_STATUS.LETTER_IN_PROGRESS,
      CASE_STATUS.READY_FOR_REVIEW
    ];
    return !allowed_statuses_for_edit_letter.includes(this.props.caseStatus);
  };

  letterPreviewNotYetLoaded = () => {
    return this.props.letterHtml === "" || !this.props.caseStatus;
  };

  saveAndGoBackToPreview = () => {
    return this.props.handleSubmit(
      this.submitEditedLetterForm(
        `/cases/${this.state.caseId}/letter/letter-preview`
      )
    );
  };

  renderSaveButton = () => {
    return (
      <PrimaryButton
        data-testid="saveButton"
        onClick={this.saveAndGoBackToPreview()}
        disabled={this.props.pristine}
      >
        Save Edited Letter
      </PrimaryButton>
    );
  };

  renderBackToCaseButton = () => {
    return (
      <LinkButton
        data-testid="save-and-return-to-case-link"
        onClick={this.pageChangeCallback(`/cases/${this.state.caseId}`)}
        style={{ margin: "2% 0% 2% 4%" }}
      >
        Back to Case
      </LinkButton>
    );
  };

  renderCancelButton = () => {
    return (
      <SecondaryButton
        data-testid="cancel-button"
        onClick={() => {
          this.props.dispatch(
            push(`/cases/${this.state.caseId}/letter/letter-preview`)
          );
        }}
        disabled={this.props.pristine}
      >
        Cancel
      </SecondaryButton>
    );
  };

  pageChangeCallback = redirectUrl => {
    return this.props.handleSubmit((values, dispatch) => {
      dispatch(push(redirectUrl));
    });
  };

  stripWhitespaceBeforeLastParagraphElement = htmlString => {
    return htmlString.substring(0, htmlString.length - 4).trim() + "</p>";
  };

  submitEditedLetterForm = redirectUrl => (values, dispatch) => {
    shouldBlockRoutingRedirects(false);
    values.editedLetterHtml = this.stripWhitespaceBeforeLastParagraphElement(
      values.editedLetterHtml
    );
    dispatch(editReferralLetterContent(this.state.caseId, values, redirectUrl));
  };

  render() {
    if (this.letterPreviewNotYetLoaded() || this.invalidCaseStatus()) {
      return null;
    }

    return (
      <div>
        <NavBar menuType={policeDataManagerMenuOptions}>
          {`Case #${this.props.caseReference}   : Letter Generation`}
        </NavBar>

        {this.renderBackToCaseButton()}

        <div
          style={{
            margin: "0% auto 3%",
            maxWidth: "60rem",
            padding: "0% 5% 0%"
          }}
        >
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
              variant="h6"
              data-testid="edit-letter-page-header"
            >
              Edit Letter
            </Typography>
            <CancelEditLetterConfirmationDialog
              caseId={this.state.caseId}
              shouldBlockRoutingRedirects={shouldBlockRoutingRedirects}
              redirectUrl={this.state.redirectUrl}
            />
            <Card
              style={{
                marginBottom: "24px",
                backgroundColor: "white"
              }}
            >
              <CardContent>
                <form data-testid="editLetterForm">
                  <Field
                    name="editedLetterHtml"
                    data-testid="editLetterHtml"
                    component={RichTextEditorComponent}
                    fullWidth
                    multiline
                    style={{ marginBottom: "16px" }}
                  />
                </form>
              </CardContent>
            </Card>

            <div style={{ display: "flex" }}>
              <span style={{ flex: 1 }}>{this.renderCancelButton()}</span>
              <span style={{ flex: 1, textAlign: "right" }}>
                {this.renderSaveButton()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditLetter.propTypes = {
  caseReference: PropTypes.string,
  caseStatus: PropTypes.string,
  dirty: PropTypes.bool,
  dispatch: PropTypes.func,
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.shape({
    editedLetterHtml: PropTypes.string
  }),
  invalidCaseStatusRedirect: PropTypes.func,
  letterHtml: PropTypes.string,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number
    })
  }),
  pristine: PropTypes.bool
};

const mapStateToProps = state => ({
  initialValues: { editedLetterHtml: state.referralLetter.letterHtml },
  caseReference: state.currentCase.details.caseReference,
  caseStatus: state.currentCase.details.status
});

const mapDispatchToProps = {
  invalidCaseStatusRedirect
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxForm({ form: EDIT_LETTER_HTML_FORM })(EditLetter));
