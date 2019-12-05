import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { Field, formValueSelector } from "redux-form";
import styles from "../../../../common/globalStyling/styles";
import RichTextEditor from "../../../shared/components/RichTextEditor/RichTextEditor";
import LinkButton from "../../../shared/components/LinkButton";
import { openRemoveOfficerHistoryNoteDialog } from "../../../actionCreators/letterActionCreators";
import { connect } from "react-redux";
import { renderField } from "../../sharedFormComponents/renderFunctions";

const RichTextEditorComponent = props => (
  <RichTextEditor
    initialValue={props.input.value}
    onChange={newValue => props.input.onChange(newValue)}
  />
);

const OfficerHistoryNote = props => {
  const {
    referralLetterOfficerHistoryNote,
    openRemoveOfficerHistoryNoteDialog,
    fieldArrayName,
    noteIndex,
    caseOfficerName,
    pibCaseNumber,
    details
  } = props;

  const openRemoveNoteDialog = () => {
    const noteDetails = { caseOfficerName, pibCaseNumber, details };
    openRemoveOfficerHistoryNoteDialog(fieldArrayName, noteIndex, noteDetails);
  };

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
            component={renderField}
            label="Case Reference Number"
            style={{ width: "40%", marginBottom: "32px" }}
            inputProps={{ "data-test": "note-pib-case-number", maxLength: 255 }}
          />
          <div style={{ marginTop: "16px" }}>
            <LinkButton
              onClick={openRemoveNoteDialog}
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
            name={`${referralLetterOfficerHistoryNote}.details`}
            component={RichTextEditorComponent}
            label="Summary or details"
          />
        </div>
      </CardContent>
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

const mapDispatchToProps = {
  openRemoveOfficerHistoryNoteDialog
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OfficerHistoryNote);
