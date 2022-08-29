import getReferralLetterData from "../thunks/getReferralLetterData";
import _ from "lodash";
import { LETTER_PROGRESS } from "../../../../../sharedUtilities/constants";
import NavBar from "../../../shared/components/NavBar/NavBar";
import { Card, CardContent, Typography } from "@material-ui/core";
import LinkButton from "../../../shared/components/LinkButton";
import LetterProgressStepper from "../LetterProgressStepper";
import React, { Component, Fragment } from "react";
import { Field, FieldArray, reduxForm } from "redux-form";
import { connect } from "react-redux";
import styles from "../../../../common/globalStyling/styles";
import standards from "../../../../common/globalStyling/standards";
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
import LetterStatusMessage from "../../CaseDetails/LetterStatusMessage/LetterStatusMessage";
import getReferralLetterEditStatus from "../thunks/getReferralLetterEditStatus";
import getCaseDetails from "../../thunks/getCaseDetails";
import getMinimumCaseDetails from "../../thunks/getMinimumCaseDetails";
import getClassificationOptions from "../thunks/getClassificationOptions";
import { policeDataManagerMenuOptions } from "../../../shared/components/NavBar/policeDataManagerMenuOptions";
import Classifications from "./Classifications";
import editClassifications from "../thunks/editClassifications";
import { renderTextField } from "../../sharedFormComponents/renderFunctions";

const {
  RECOMMENDED_ACTIONS_TEXT,
  RETALIATION_CONCERNS_LABEL,
  RETALIATION_CONCERNS_TEXT
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/referralLetterDefaults`);

class RecommendedActions extends Component {
  constructor(props) {
    super(props);
    this.state = { caseId: this.props.match.params.id };
  }

  componentDidMount() {
    this.props.getReferralLetterData(this.state.caseId);
    this.props.getCaseDetails(this.state.caseId);
    this.props.getReferralLetterEditStatus(this.state.caseId);
    this.props.getRecommendedActions();
    this.props.getClassificationOptions();
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

  saveAndGoBack = () => {
    return this.props.handleSubmit(
      this.submitForm(`/cases/${this.state.caseId}/letter/officer-history`)
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
    let classificationValues = {
      id: values.id,
      classifications: {}
    };
    classificationValues.classifications = this.props.classifications.map(
      classification => {
        if (values[`csfn-${classification.id}`] === true) {
          return classification.id;
        }
        return null;
      }
    );

    dispatch(editClassifications(this.state.caseId, classificationValues));
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

    letterOfficer.referralLetterOfficerRecommendedActions =
      selectedRecommendedActions.filter(action => action !== null);
  };

  renderOfficerCards = ({ fields }) => {
    return fields.map((letterOfficerField, index) => {
      const letterOfficerInstance = fields.get(index);
      return (
        <Fragment key={letterOfficerInstance.id}>
          <Typography
            style={{ marginBottom: standards.small, ...styles.section }}
          >
            {letterOfficerInstance.fullName}
          </Typography>
          <Card style={styles.cardStyling}>
            <CardContent style={styles.cardStyling}>
              <Typography style={{ marginBottom: "24px", fontWeight: "bold" }}>
                Request for Review and Intervention
              </Typography>
              <Typography style={{ marginBottom: standards.small }}>
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
                    name={`${letterOfficerField}.action-${recommendedAction.id}`}
                    component={PrimaryCheckBox}
                    data-testid={`${letterOfficerField}-${recommendedAction.id}`}
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
            component={renderTextField}
            multiline
            rowsMax={5}
            data-testid={`${letterOfficerField}-recommendedActionNotes`}
            placeholder={"Additional notes or concerns"}
            inputProps={{ autoComplete: "off" }}
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
        <NavBar menuType={policeDataManagerMenuOptions}>
          {`Case #${this.props.caseReference}   : Letter Generation`}
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
                variant="h6"
                data-testid="recommended-actions-page-header"
              >
                Recommended Actions
              </Typography>
              <LetterStatusMessage />

              <Card style={styles.cardStyling}>
                <CardContent style={styles.cardStyling}>
                  <BoldCheckBoxFormControlLabel
                    name="includeRetaliationConcerns"
                    label={RETALIATION_CONCERNS_LABEL}
                    dataTest="include-retaliation-concerns-field"
                  />

                  <Typography style={{ marginLeft: standards.large }}>
                    {RETALIATION_CONCERNS_TEXT}
                  </Typography>
                </CardContent>
              </Card>
              <Classifications
                initialDisabled={this.props.initialValues["csfn-4"]}
                classifications={this.props.classifications}
              />
              <FieldArray
                name="letterOfficers"
                component={this.renderOfficerCards}
              />
              <div style={{ display: "flex" }}>
                <span style={{ flex: 1 }}>
                  <SecondaryButton
                    onClick={this.saveAndGoBack()}
                    data-testid="back-button"
                  >
                    Back
                  </SecondaryButton>
                </span>
                <span style={{ flex: 1, textAlign: "right" }}>
                  <PrimaryButton
                    onClick={this.saveAndGoToLetterPreview()}
                    data-testid="next-button"
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
  accused: state.currentCase.details.accusedOfficers,
  allowAccusedOfficersToBeBlankFeature:
    state.featureToggles.allowAccusedOfficersToBeBlankFeature,
  recommendedActions: state.recommendedActions,
  letterDetails: state.referralLetter.letterDetails,
  initialValues: {
    id: state.referralLetter.letterDetails.id,
    includeRetaliationConcerns:
      state.referralLetter.letterDetails.includeRetaliationConcerns,
    letterOfficers: state.referralLetter.letterDetails.letterOfficers,
    ...state.referralLetter.letterDetails.classifications
  },
  caseReference: state.currentCase.details.caseReference,
  classifications: state.classifications
});

const mapDispatchToProps = {
  getCaseDetails,
  getClassificationOptions,
  getMinimumCaseDetails,
  getRecommendedActions,
  getReferralLetterData,
  getReferralLetterEditStatus
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({ form: "RecommendedActions", enableReinitialize: true })(
    RecommendedActions
  )
);
