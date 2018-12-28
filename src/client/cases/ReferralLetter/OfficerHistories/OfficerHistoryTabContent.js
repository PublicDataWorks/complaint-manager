import React, { Fragment } from "react";
import { Typography } from "@material-ui/core";
import styles from "../../../globalStyling/styles";
import { TextField } from "redux-form-material-ui";
import { Field, FieldArray, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { isIntegerString } from "../../../formFieldLevelValidations";
import RichTextEditor from "../../../shared/components/RichTextEditor/RichTextEditor";
import OfficerHistoryNote from "./OfficerHistoryNote";
import LinkButton from "../../../shared/components/LinkButton";
import calculateOfficerHistoryTotalAllegations from "./calculateOfficerHistoryTotalAllegations";
import shortid from "shortid";
import { numbersOnly } from "../../../utilities/fieldFormatters";
import { OFFICER_HISTORY_MESSAGE } from "../../../../server/handlers/cases/referralLetters/letterDefaults";

const RichTextEditorComponent = props => (
  <RichTextEditor
    initialValue={props.input.value}
    onChange={newValue => props.input.onChange(newValue)}
  />
);

const OfficerHistoryTabContent = props => {
  const {
    letterOfficer,
    caseOfficerName,
    caseOfficerId,
    isSelectedOfficer
  } = props;
  const displayValue = isSelectedOfficer ? "block" : "none";

  const addNewOfficerNote = fields => () => {
    const newNote = { tempId: shortid.generate() };
    fields.push(newNote);
  };

  const renderNoteFields = ({ fields }) => {
    return (
      <Fragment>
        {renderOfficerHistoryNotes(fields)}
        <LinkButton
          onClick={addNewOfficerNote(fields)}
          data-test="addOfficerHistoryNoteButton"
        >
          + Add A Note
        </LinkButton>
      </Fragment>
    );
  };

  const renderOfficerHistoryNotes = fields => {
    return fields.map((referralLetterOfficerHistoryNoteField, index) => {
      const referralLetterOfficerHistoryNoteInstance = fields.get(index);
      const uniqueKey =
        referralLetterOfficerHistoryNoteInstance.id ||
        referralLetterOfficerHistoryNoteInstance.tempId;
      return (
        <OfficerHistoryNote
          referralLetterOfficerHistoryNote={
            referralLetterOfficerHistoryNoteField
          }
          key={uniqueKey}
          fieldArrayName={`${letterOfficer}.referralLetterOfficerHistoryNotes`}
          noteIndex={index}
          caseOfficerName={caseOfficerName}
        />
      );
    });
  };

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
          inputProps={{maxLength: 5}}
        />
        <Field
          style={{ margin: "8px 24px 0 0", flex: 1 }}
          name={`${letterOfficer}.numHistoricalMedAllegations`}
          component={TextField}
          label="Medium Level"
          data-test={`${letterOfficer}-numHistoricalMedAllegations`}
          normalize={numbersOnly}
          inputProps={{maxLength: 5}}
        />
        <Field
          style={{ margin: "8px 24px 0 0", flex: 1 }}
          name={`${letterOfficer}.numHistoricalLowAllegations`}
          component={TextField}
          label="Low Level"
          data-test={`${letterOfficer}-numHistoricalLowAllegations`}
          normalize={numbersOnly}
          inputProps={{maxLength: 5}}
        />
        <Typography
          style={{ flex: 1, marginTop: "32px" }}
          data-test={`officers-${caseOfficerId}-total-historical-allegations`}
        >
          <b>{calculateOfficerHistoryTotalAllegations(props)}</b> total
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
      <Typography style={{ paddingBottom: "16px", ...styles.section }}>
        Notes
      </Typography>
      <FieldArray
        name={`${letterOfficer}.referralLetterOfficerHistoryNotes`}
        component={renderNoteFields}
      />
    </div>
  );
};

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

export default connect(mapStateToProps)(OfficerHistoryTabContent);
