import getReferralLetterData from "../thunks/getReferralLetterData";
import _ from "lodash";
import { LETTER_PROGRESS } from "../../../../sharedUtilities/constants";
import NavBar from "../../../shared/components/NavBar/NavBar";
import { Card, CardContent, Typography } from "@material-ui/core";
import LinkButton from "../../../shared/components/LinkButton";
import LetterProgressStepper from "../LetterProgressStepper";
import React, { Component, Fragment } from "react";
import { Field, FieldArray, reduxForm } from "redux-form";
import { connect } from "react-redux";
import styles from "../../../globalStyling/styles";
import { TextField } from "redux-form-material-ui";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";
import editRecommendedActions from "../thunks/editRecommendedActions";
import getRecommendedActions from "../thunks/getRecommendedActions";
import BoldCheckBoxFormControlLabel from "../../../shared/components/BoldCheckBoxFormControlLabel";
import PrimaryCheckBox from "../../../shared/components/PrimaryCheckBox";
import {
  RECOMMENDED_ACTIONS_TEXT,
  RETALIATION_CONCERNS_LABEL,
  RETALIATION_CONCERNS_TEXT
} from "../../../../server/handlers/cases/referralLetters/letterDefaults";
import EditLetterStatusMessage from "../../CaseDetails/EditLetterStatusMessage/EditLetterStatusMessage";
import getLetterType from "../thunks/getLetterType";
import getMinimumCaseDetails from "../../thunks/getMinimumCaseDetails";

class RecommendedActions extends Component {
  constructor(props) {
    super(props);
    this.state = { caseId: this.props.match.params.id };
  }

  componentDidMount() {
    this.props.getReferralLetterData(this.state.caseId);
    this.props.getMinimumCaseDetails(this.state.caseId);
    this.props.getLetterType(this.state.caseId);
    this.props.getRecommendedActions();
  }

  referralLetterNotYetLoaded = () => {
    return (
      _.isEmpty(this.props.letterDetails) ||
      `${this.props.letterDetails.caseId}` !== this.state.caseId
    );
  };

  saveAndReturnToCase = () => {
    return this.props.handleSubmit(
      this.submitForm(`/cases/${this.state.caseId}`)
    );
  };

  saveAndGoBackToIAProCorrections = () => {
    return this.props.handleSubmit(
      this.submitForm(`/cases/${this.state.caseId}/letter/iapro-corrections`)
    );
  };

  saveAndGoToLetterPreview = () => {
    return this.props.handleSubmit(
      this.submitForm(`/cases/${this.state.caseId}/letter/letter-preview`)
    );
  };

  pageChangeCallback = redirectUrl => {
    return this.props.handleSubmit(this.submitForm(redirectUrl));
  };

  submitForm = redirectUrl => (values, dispatch) => {
    values.letterOfficers = values.letterOfficers.map(letterOfficer => {
      this.transformReferralLetterOfficerRecommendedActions(letterOfficer);
      return letterOfficer;
    });

    dispatch(editRecommendedActions(this.state.caseId, values, redirectUrl));
  };

  transformReferralLetterOfficerRecommendedActions = letterOfficer => {
    const selectedRecommendedActions = this.props.recommendedActions.map(
      recommendedAction => {
        if (letterOfficer[`action-${recommendedAction.id}`] === true) {
          return recommendedAction.id;
        }
        return null;
      }
    );

    letterOfficer.referralLetterOfficerRecommendedActions = selectedRecommendedActions.filter(
      action => action !== null
    );
  };

  renderOfficerCards = ({ fields }) => {
    return fields.map((letterOfficerField, index) => {
      const letterOfficerInstance = fields.get(index);
      return (
        <Fragment key={letterOfficerInstance.id}>
          <Typography style={{ marginBottom: "16px", ...styles.section }}>
            {letterOfficerInstance.fullName}
          </Typography>
          <Card
            style={{
              marginBottom: "24px",
              backgroundColor: "white"
            }}
          >
            <CardContent
              style={{
                marginBottom: "24px",
                backgroundColor: "white"
              }}
            >
              <Typography style={{ marginBottom: "24px", fontWeight: "bold" }}>
                Request for Review and Intervention
              </Typography>
              <Typography style={{ marginBottom: "16px" }}>
                {RECOMMENDED_ACTIONS_TEXT}
              </Typography>
              {this.renderOfficerFields(letterOfficerField)}
            </CardContent>
          </Card>
        </Fragment>
      );
    });
  };

  renderOfficerFields = letterOfficerField => {
    return (
      <Fragment>
        <FormGroup style={{ marginBottom: "24px" }}>
          {this.props.recommendedActions.map(recommendedAction => {
            return (
              <FormControlLabel
                key={recommendedAction.id}
                label={recommendedAction.description}
                control={
                  <Field
                    name={`${letterOfficerField}.action-${
                      recommendedAction.id
                    }`}
                    component={PrimaryCheckBox}
                    data-test={`${letterOfficerField}-${recommendedAction.id}`}
                  />
                }
              />
            );
          })}
        </FormGroup>
        <div>
          <Field
            name={`${letterOfficerField}.recommendedActionNotes`}
            style={{ width: "70%" }}
            component={TextField}
            multiline
            rowsMax={5}
            data-test={`${letterOfficerField}-recommendedActionNotes`}
            placeholder={"Additional notes or concerns"}
          />
        </div>
      </Fragment>
    );
  };

  render() {
    if (this.referralLetterNotYetLoaded()) {
      return null;
    } else {
      for (const letterOfficer of this.props.letterDetails.letterOfficers) {
        for (const recommendedAction of letterOfficer.referralLetterOfficerRecommendedActions) {
          letterOfficer[`action-${recommendedAction}`] = true;
        }
      }
    }

    return (
      <div>
        <NavBar>
          <Typography data-test="pageTitle" variant="title" color="inherit">
            {`Case #${this.props.caseReference}   : Letter Generation`}
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
              currentLetterStatus={LETTER_PROGRESS.RECOMMENDED_ACTIONS}
              pageChangeCallback={this.pageChangeCallback}
              caseId={this.state.caseId}
            />
            <div style={{ margin: "0 0 32px 0" }}>
              <Typography
                style={{
                  marginBottom: "24px"
                }}
                variant="title"
                data-test="recommended-actions-page-header"
              >
                Recommended Actions
              </Typography>
              <EditLetterStatusMessage />

              <Card
                style={{
                  marginBottom: "24px",
                  backgroundColor: "white"
                }}
              >
                <CardContent
                  style={{ backgroundColor: "white", marginBottom: "24px" }}
                >
                  <BoldCheckBoxFormControlLabel
                    name="includeRetaliationConcerns"
                    labelText={RETALIATION_CONCERNS_LABEL}
                    dataTest="include-retaliation-concerns-field"
                  />

                  <Typography style={{ marginLeft: "40px" }}>
                    {RETALIATION_CONCERNS_TEXT}
                  </Typography>
                </CardContent>
              </Card>
              <FieldArray
                name="letterOfficers"
                component={this.renderOfficerCards}
              />
              <div style={{ display: "flex" }}>
                <span style={{ flex: 1 }}>
                  <SecondaryButton
                    onClick={this.saveAndGoBackToIAProCorrections()}
                    data-test="back-button"
                  >
                    Back
                  </SecondaryButton>
                </span>
                <span style={{ flex: 1, textAlign: "right" }}>
                  <PrimaryButton
                    onClick={this.saveAndGoToLetterPreview()}
                    data-test="next-button"
                  >
                    Next
                  </PrimaryButton>
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  recommendedActions: state.recommendedActions,
  letterDetails: state.referralLetter.letterDetails,
  initialValues: {
    id: state.referralLetter.letterDetails.id,
    includeRetaliationConcerns:
      state.referralLetter.letterDetails.includeRetaliationConcerns,
    letterOfficers: state.referralLetter.letterDetails.letterOfficers
  },
  caseReference: state.currentCase.details.caseReference
});

const mapDispatchToProps = {
  getReferralLetterData,
  getMinimumCaseDetails,
  getLetterType,
  getRecommendedActions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({ form: "RecommendedActions", enableReinitialize: true })(
    RecommendedActions
  )
);
