import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { Field } from "redux-form";
import { TextField } from "redux-form-material-ui";
import styles from "../../../globalStyling/styles";
import RichTextEditor from "../../../shared/components/RichTextEditor/RichTextEditor";
import LinkButton from "../../../shared/components/LinkButton";
import { openRemoveOfficerHistoryNoteDialog } from "../../../actionCreators/letterActionCreators";
import { connect } from "react-redux";

const RichTextEditorComponent = props => (
  <RichTextEditor
    initialValue={props.input.value}
    onChange={newValue => props.input.onChange(newValue)}
  />
);

const OfficerHistoryNote = props => {
  const {
    note,
    openRemoveOfficerHistoryNoteDialog,
    fieldArrayName,
    noteIndex
  } = props;

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
            name={`${note}.pibCaseNumber`}
            component={TextField}
            label="Case Reference Number (optional)"
            style={{ width: "40%", marginBottom: "32px" }}
            inputProps={{ "data-test": "note-pib-case-number" }}
          />
          <div style={{ marginTop: "16px" }}>
            <LinkButton
              onClick={() => {
                openRemoveOfficerHistoryNoteDialog(fieldArrayName, noteIndex);
              }}
              data-test={`note-${noteIndex}-openRemoveOfficerHistoryNoteButton`}
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
            name={`${note}.summary`}
            component={RichTextEditorComponent}
            label="Summary or details"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const mapDispatchToProps = {
  openRemoveOfficerHistoryNoteDialog
};

export default connect(
  undefined,
  mapDispatchToProps
)(OfficerHistoryNote);
