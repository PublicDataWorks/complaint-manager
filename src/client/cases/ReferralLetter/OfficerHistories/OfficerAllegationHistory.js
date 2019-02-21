import React from "react";
import { Typography } from "@material-ui/core";
import styles from "../../../globalStyling/styles";
import { TextField } from "redux-form-material-ui";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { connect } from "react-redux";
import RichTextEditor from "../../../shared/components/RichTextEditor/RichTextEditor";
import calculateOfficerHistoryTotalAllegations from "./calculateOfficerHistoryTotalAllegations";
import { numbersOnly } from "../../../utilities/fieldFormatters";
import { OFFICER_HISTORY_MESSAGE } from "../../../../server/handlers/cases/referralLetters/referralLetterDefaults";

const RichTextEditorComponent = props => (
  <RichTextEditor
    initialValue={props.input.value}
    onChange={newValue => props.input.onChange(newValue)}
  />
);

class OfficerAllegationHistory extends React.Component {
  componentWillUnmount() {
    const letterOfficer = this.props.letterOfficer;

    this.props.change(`${letterOfficer}.numHistoricalHighAllegations`, null);
    this.props.change(`${letterOfficer}.numHistoricalMedAllegations`, null);
    this.props.change(`${letterOfficer}.numHistoricalLowAllegations`, null);
    this.props.change(`${letterOfficer}.historicalBehaviorNotes`, null);
    this.props.array.removeAll(
      `${letterOfficer}.referralLetterOfficerHistoryNotes`
    );
  }

  render() {
    const { letterOfficer, caseOfficerId } = this.props;
    return (
      <div>
        <Typography style={{ paddingBottom: "16px" }}>
          {OFFICER_HISTORY_MESSAGE}
        </Typography>
        <Typography>
          Please enter the number of allegations this officer has received over
          the past 5 years
        </Typography>
        <div style={{ display: "flex", marginBottom: "32px" }}>
          <Field
            style={{ margin: "8px 24px 0 0", flex: 1 }}
            name={`${letterOfficer}.numHistoricalHighAllegations`}
            component={TextField}
            label="High Level"
            data-test={`${letterOfficer}-numHistoricalHighAllegations`}
            normalize={numbersOnly}
            inputProps={{ maxLength: 5 }}
          />
          <Field
            style={{ margin: "8px 24px 0 0", flex: 1 }}
            name={`${letterOfficer}.numHistoricalMedAllegations`}
            component={TextField}
            label="Medium Level"
            data-test={`${letterOfficer}-numHistoricalMedAllegations`}
            normalize={numbersOnly}
            inputProps={{ maxLength: 5 }}
          />
          <Field
            style={{ margin: "8px 24px 0 0", flex: 1 }}
            name={`${letterOfficer}.numHistoricalLowAllegations`}
            component={TextField}
            label="Low Level"
            data-test={`${letterOfficer}-numHistoricalLowAllegations`}
            normalize={numbersOnly}
            inputProps={{ maxLength: 5 }}
          />
          <Typography
            style={{ flex: 1, marginTop: "32px" }}
            data-test={`officers-${caseOfficerId}-total-historical-allegations`}
          >
            <b>{calculateOfficerHistoryTotalAllegations(this.props)}</b> total
            allegations
          </Typography>
        </div>
        <Typography style={{ marginBottom: "8px", ...styles.inputLabel }}>
          Notes on any patterns of behavior
        </Typography>
        <div style={{ width: "75%", marginBottom: "32px" }}>
          <Field
            name={`${letterOfficer}.historicalBehaviorNotes`}
            component={RichTextEditorComponent}
            label="Notes on any patterns of behavior"
            data-test={`${letterOfficer}-historicalBehaviorNotes`}
          />
        </div>
      </div>
    );
  }
}

const selector = formValueSelector("OfficerHistories");
const mapStateToProps = (state, props) => ({
  numHistoricalHighAllegations: selector(
    state,
    `${props.letterOfficer}.numHistoricalHighAllegations`
  ),
  numHistoricalMedAllegations: selector(
    state,
    `${props.letterOfficer}.numHistoricalMedAllegations`
  ),
  numHistoricalLowAllegations: selector(
    state,
    `${props.letterOfficer}.numHistoricalLowAllegations`
  )
});

const ConnectedForm = connect(mapStateToProps)(OfficerAllegationHistory);

export default reduxForm({
  form: "OfficerHistories",
  destroyOnUnmount: false
})(ConnectedForm);
