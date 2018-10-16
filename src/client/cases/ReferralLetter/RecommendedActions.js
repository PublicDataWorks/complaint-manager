import getReferralLetter from "./thunks/getReferralLetter";
import _ from "lodash";
import { LETTER_PROGRESS } from "../../../sharedUtilities/constants";
import NavBar from "../../shared/components/NavBar/NavBar";
import { Card, CardContent, Typography } from "@material-ui/core";
import LinkButton from "../../shared/components/LinkButton";
import LetterProgressStepper from "./LetterProgressStepper";
import React, { Component, Fragment } from "react";
import { Field, FieldArray, reduxForm } from "redux-form";
import { connect } from "react-redux";
import Checkbox from "@material-ui/core/es/Checkbox/Checkbox";
import styles from "../../globalStyling/styles";
import TextField from "@material-ui/core/es/TextField/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";

class RecommendedActions extends Component {
  constructor(props) {
    super(props);
    this.state = { caseId: this.props.match.params.id, checked: false };
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

  selectIncludeRetaliationConcerns = (event, checked) => {
    this.setState({ checked: event.target.checked });
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
          <FormControlLabel
            label={
              "Be temporarily or permanently reassigned from his/her current assignment"
            }
            control={
              <Field
                name={`${referralLetterOfficerField}.reassigned`}
                component={Checkbox}
                data-test={`${referralLetterOfficerField}-reassigned`}
              />
            }
          />
          <FormControlLabel
            label={"Receive training regarding any issues noted"}
            control={
              <Field
                name={`${referralLetterOfficerField}.training`}
                component={Checkbox}
                data-test={`${referralLetterOfficerField}-training`}
              />
            }
          />
          <FormControlLabel
            label={"Receive supervisory interventions and monitoring - INSIGHT"}
            control={
              <Field
                name={`${referralLetterOfficerField}.insight`}
                component={Checkbox}
                data-test={`${referralLetterOfficerField}-insight`}
              />
            }
          />
          <FormControlLabel
            label={"Be subject to a Fitness for Duty Assessment"}
            control={
              <Field
                name={`${referralLetterOfficerField}.fitness`}
                component={Checkbox}
                data-test={`${referralLetterOfficerField}-fitness`}
              />
            }
          />
          <FormControlLabel
            label={"Be the subject of Integrity Checks"}
            control={
              <Field
                name={`${referralLetterOfficerField}.integrity`}
                component={Checkbox}
                data-test={`${referralLetterOfficerField}-integrity`}
              />
            }
          />
        </FormGroup>
        <div>
          <Field
            name={`${referralLetterOfficerField}.notes`}
            style={{ width: "50%" }}
            component={TextField}
            data-test={`${referralLetterOfficerField}-notes`}
            placeholder={"Additional notes or concerns"}
          />
        </div>
      </Fragment>
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
                        name="includeRetaliationConcernsField"
                        component={Checkbox}
                        data-test="include-retaliation-concerns-field"
                        inputProps={{
                          onChange: this.selectIncludeRetaliationConcerns
                        }}
                        checked={this.state.checked}
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
