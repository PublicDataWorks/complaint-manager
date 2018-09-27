import React from "react";
import { Typography } from "@material-ui/core";
import styles from "../../../globalStyling/styles";
import { TextField } from "redux-form-material-ui";
import { Field, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { isIntegerString } from "../../../formFieldLevelValidations";
import RichTextEditor from "../../../shared/components/RichTextEditor/RichTextEditor";

const totalAllegations = props => {
  const {
    numberHistoricalHighAllegations,
    numberHistoricalMediumAllegations,
    numberHistoricalLowAllegations
  } = props;
  let total = 0;
  total += getIntegerFromValue(numberHistoricalHighAllegations);
  total += getIntegerFromValue(numberHistoricalMediumAllegations);
  total += getIntegerFromValue(numberHistoricalLowAllegations);
  return total;
};

const getIntegerFromValue = value => {
  const error = isIntegerString(value);
  if (error === undefined) {
    return parseInt(value, 10) || 0;
  }
  return 0;
};

const RichTextEditorComponent = props => (
  <RichTextEditor
    initialValue={props.input.value}
    onChange={newValue => props.input.onChange(newValue)}
    style={{ height: "160px" }}
  />
);

const OfficerHistoryTabContent = props => {
  const { officer, caseOfficerName, caseOfficerId, isSelectedOfficer } = props;
  const displayValue = isSelectedOfficer ? "block" : "none";

  return (
    <div
      style={{ padding: "24px", display: displayValue }}
      key={caseOfficerId}
      data-test={`tab-content-${caseOfficerId}`}
    >
      <Typography
        variant="title"
        style={{ paddingBottom: "16px", ...styles.section }}
      >
        {caseOfficerName}
      </Typography>
      <Typography style={{ paddingBottom: "16px" }}>
        The IPM has reviewed this officer’s disciplinary history for the last
        five years and has determined that the subject employee has the
        following significant/noteworthy number of complaints.
      </Typography>
      <Typography>
        Please enter the number of allegations this officer has received over
        the past 5 years
      </Typography>
      <div style={{ display: "flex", marginBottom: "32px" }}>
        <Field
          style={{ margin: "8px 24px 0 0", flex: 1 }}
          name={`${officer}.numberHistoricalHighAllegations`}
          component={TextField}
          label="High Level"
          data-test={`${officer}-numberHistoricalHighAllegations`}
          validate={[isIntegerString]}
        />
        <Field
          style={{ margin: "8px 24px 0 0", flex: 1 }}
          name={`${officer}.numberHistoricalMediumAllegations`}
          component={TextField}
          label="Medium Level"
          data-test={`${officer}-numberHistoricalMediumAllegations`}
          validate={[isIntegerString]}
        />
        <Field
          style={{ margin: "8px 24px 0 0", flex: 1 }}
          name={`${officer}.numberHistoricalLowAllegations`}
          component={TextField}
          label="Low Level"
          data-test={`${officer}-numberHistoricalLowAllegations`}
          validate={[isIntegerString]}
        />
        <Typography
          style={{ flex: 1, marginTop: "32px" }}
          data-test={`officers-${caseOfficerId}-total-historical-allegations`}
        >
          <b>{totalAllegations(props)}</b> total allegations
        </Typography>
      </div>
      <Typography style={{ marginBottom: "8px", ...styles.inputLabel }}>
        Notes on any patterns of behavior
      </Typography>
      <div style={{ width: "60%", marginBottom: "32px" }}>
        <Field
          name={`${officer}.historicalBehaviorNotes`}
          component={RichTextEditorComponent}
          label="Notes on any patterns of behavior"
          data-test={`${officer}-historicalBehaviorNotes`}
        />
      </div>
    </div>
  );
};

const selector = formValueSelector("OfficerHistories");
export default connect((state, props) => {
  return {
    numberHistoricalHighAllegations: selector(
      state,
      `${props.officer}.numberHistoricalHighAllegations`
    ),
    numberHistoricalMediumAllegations: selector(
      state,
      `${props.officer}.numberHistoricalMediumAllegations`
    ),
    numberHistoricalLowAllegations: selector(
      state,
      `${props.officer}.numberHistoricalLowAllegations`
    )
  };
})(OfficerHistoryTabContent);
