import getReferralLetter from "../thunks/getReferralLetter";
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
import { TextField, Checkbox } from "redux-form-material-ui";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import { SecondaryButton } from "../../../shared/components/StyledButtons";
import editRecommendedActions from "../thunks/editRecommendedActions";
import getRecommendedActions from "../thunks/getRecommendedActions";

class RecommendedActions extends Component {
  constructor(props) {
    super(props);
    this.state = { caseId: this.props.match.params.id };
  }

  componentDidMount() {
    this.props.dispatch(getReferralLetter(this.state.caseId));
    this.props.dispatch(getRecommendedActions());
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

  submitForm = redirectUrl => (values, dispatch) => {
    values.referralLetterOfficers = values.referralLetterOfficers.map(
      letterOfficer => {
        this.transformReferralLetterOfficerRecommendedActions(letterOfficer);
        return letterOfficer;
      }
    );

    dispatch(editRecommendedActions(this.state.caseId, values, redirectUrl));
  };

  transformReferralLetterOfficerRecommendedActions = referralLetterOfficer => {
    const selectedRecommendedActions = this.props.recommendedActions.map(
      recommendedAction => {
        if (referralLetterOfficer[`action-${recommendedAction.id}`] === true) {
          return recommendedAction.id;
        }
      }
    );

    referralLetterOfficer.referralLetterOfficerRecommendedActions = selectedRecommendedActions.filter(
      action => action !== undefined
    );
  };

  renderOfficerCards = ({ fields }) => {
    return fields.map((referralLetterOfficerField, index) => {
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
                In light of the seriousness of the allegations and/or the
                subject officer’s complaint history, the IPM requests that,
                pending the completion of this investigation, PIB review this
                officer’s history to ascertain if the accused officer should:
              </Typography>
              {this.renderOfficerFields(referralLetterOfficerField)}
            </CardContent>
          </Card>
        </Fragment>
      );
    });
  };

  renderOfficerFields = referralLetterOfficerField => {
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
                    name={`${referralLetterOfficerField}.action-${
                      recommendedAction.id
                    }`}
                    component={Checkbox}
                    data-test={`${referralLetterOfficerField}-${
                      recommendedAction.id
                    }`}
                  />
                }
              />
            );
          })}
        </FormGroup>
        <div>
          <Field
            name={`${referralLetterOfficerField}.recommendedActionNotes`}
            style={{ width: "50%" }}
            component={TextField}
            data-test={`${referralLetterOfficerField}-recommendedActionNotes`}
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
      for (const letterOfficer of this.props.letterDetails
        .referralLetterOfficers) {
        for (const recommendedAction of letterOfficer.referralLetterOfficerRecommendedActions) {
          letterOfficer[`action-${recommendedAction}`] = true;
        }
      }
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
            Save and Return to Case
          </LinkButton>

          <div style={{ margin: "0% 5% 3%", width: "60%" }}>
            <LetterProgressStepper
              currentLetterStatus={LETTER_PROGRESS.RECOMMENDED_ACTIONS}
            />
            <div style={{ margin: "0 0 32px 0" }}>
              <Typography
                style={{
                  marginBottom: "24px"
                }}
                variant="title"
              >
                Recommended Actions
              </Typography>
              <Card
                style={{
                  marginBottom: "24px",
                  backgroundColor: "white"
                }}
              >
                <CardContent
                  style={{ backgroundColor: "white", marginBottom: "24px" }}
                >
                  <FormControlLabel
                    control={
                      <Field
                        name="includeRetaliationConcerns"
                        component={Checkbox}
                        data-test="include-retaliation-concerns-field"
                      />
                    }
                    label={
                      "Include Retaliation Concerns and Request for Notice to Officer(s)"
                    }
                  />

                  <Typography style={{ marginLeft: "40px" }}>
                    Based on the information provided by the complainant, the
                    OIPM is concerned about retaliation against the complainant.
                    We request that once the accused officer is made aware of
                    this complaint that he/she be admonished in writing by
                    his/her commanding officer about retaliating against the
                    Complainant, or from having others do so.
                  </Typography>
                </CardContent>
              </Card>
              <FieldArray
                name="referralLetterOfficers"
                component={this.renderOfficerCards}
              />
              <SecondaryButton
                onClick={this.saveAndGoBackToIAProCorrections()}
                data-test="back-button"
              >
                Back
              </SecondaryButton>
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
    referralLetterOfficers:
      state.referralLetter.letterDetails.referralLetterOfficers
  }
});

export default connect(mapStateToProps)(
  reduxForm({ form: "RecommendedActions", enableReinitialize: true })(
    RecommendedActions
  )
);
