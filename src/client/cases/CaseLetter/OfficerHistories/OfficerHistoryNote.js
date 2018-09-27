import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { Field } from "redux-form";
import { TextField } from "redux-form-material-ui";
import styles from "../../../globalStyling/styles";
import RichTextEditor from "../../../shared/components/RichTextEditor/RichTextEditor";

const RichTextEditorComponent = props => (
  <RichTextEditor
    initialValue={props.input.value}
    onChange={newValue => props.input.onChange(newValue)}
  />
);

const OfficerHistoryNote = props => {
  const { note } = props;
  return (
    <Card
      style={{
        marginBottom: "24px",
        backgroundColor: "white",
        ...styles.floatingCard
      }}
    >
      <CardContent>
        <div>
          <Field
            name={`${note}.pibCaseNumber`}
            component={TextField}
            label="Case Reference Number (optional)"
            style={{ width: "40%", marginBottom: "32px" }}
          />
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

export default OfficerHistoryNote;
