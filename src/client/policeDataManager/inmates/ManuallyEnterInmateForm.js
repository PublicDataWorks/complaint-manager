import { Card, CardContent, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Field, reduxForm } from "redux-form";
import { MANUALLY_ENTER_INMATE_FORM } from "../../../sharedUtilities/constants";
import { renderTextField } from "../cases/sharedFormComponents/renderFunctions";
import { PrimaryButton } from "../shared/components/StyledButtons";

const ManuallyEnterInmateForm = props => {
  const [submitting, setSubmitting] = useState(false);

  return (
    <form onSubmit={props.handleSubmit(() => {})}>
      <Typography variant="h6" style={{ marginBottom: "16px" }}>
        Additional Info
      </Typography>
      <Card style={{ backgroundColor: "white", marginBottom: "16px" }}>
        <CardContent>
          <Typography>Complainant Information</Typography>
        </CardContent>
        <Typography>Notes</Typography>
        <Typography variant="body2">
          Use this section to add notes, a description, or indicate any
          information about the officer's history or risk assessment.
        </Typography>
        <Field
          component={renderTextField}
          name="notes"
          data-testid="notesField"
          multiline
          maxRows={8}
          style={{ width: "60%" }}
        />
      </Card>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <PrimaryButton data-testid="inmate-submit-button" disabled={submitting}>
          Create and View
        </PrimaryButton>
      </div>
    </form>
  );
};

export default reduxForm({
  form: MANUALLY_ENTER_INMATE_FORM
})(ManuallyEnterInmateForm);
