import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { Field, formValueSelector } from "redux-form";
import styles from "../../../../common/globalStyling/styles";
import RichTextEditor from "../../../shared/components/RichTextEditor/RichTextEditor";
import LinkButton from "../../../shared/components/LinkButton";
import { connect } from "react-redux";
import { renderTextField } from "../../sharedFormComponents/renderFunctions";
import { useState } from "react";
import RemoveOfficerHistoryNoteDialog from "./RemoveOfficerHistoryNoteDialog";

const RichTextEditorComponent = props => (
  <RichTextEditor
    initialValue={props.input.value}
    onChange={newValue => props.input.onChange(newValue)}
  />
);

const OfficerHistoryNote = props => {
  const {
    referralLetterOfficerHistoryNote,
    fieldArrayName,
    noteIndex,
    caseOfficerName,
    pibCaseNumber,
    details,
    removeNote
  } = props;

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Card
      style={{
        marginBottom: "24px",
        backgroundColor: "white",
        ...styles.floatingCard
      }}
    >
      <CardContent>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Field
            name={`${referralLetterOfficerHistoryNote}.pibCaseNumber`}
            component={renderTextField}
            label="Case Reference Number"
            style={{ width: "40%", marginBottom: "32px" }}
            inputProps={{
              "data-testid": "note-pib-case-number",
              maxLength: 255,
              autoComplete: "off"
            }}
          />
          <div style={{ marginTop: "16px" }}>
            <LinkButton
              onClick={() => setDialogOpen(true)}
              data-testid={`note-${noteIndex}-openRemoveOfficerHistoryNoteButton`}
            >
              Remove
            </LinkButton>
          </div>
        </div>
        <div style={{ width: "75%" }}>
          <Typography style={{ marginBottom: "8px", ...styles.inputLabel }}>
            Summary or details
          </Typography>
          <Field
            name={`${referralLetterOfficerHistoryNote}.details`}
            component={RichTextEditorComponent}
            label="Summary or details"
          />
        </div>
      </CardContent>
      <RemoveOfficerHistoryNoteDialog
        closeDialog={() => setDialogOpen(false)}
        dialogOpen={dialogOpen}
        fieldArrayName={fieldArrayName}
        noteDetails={{ caseOfficerName, pibCaseNumber, details }}
        noteIndex={noteIndex}
        removeNote={removeNote}
      />
    </Card>
  );
};

const selector = formValueSelector("OfficerHistories");
const mapStateToProps = (state, props) => ({
  pibCaseNumber: selector(
    state,
    `${props.referralLetterOfficerHistoryNote}.pibCaseNumber`
  ),
  details: selector(state, `${props.referralLetterOfficerHistoryNote}.details`)
});

export default connect(mapStateToProps)(OfficerHistoryNote);
