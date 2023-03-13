import { Card, CardContent, Typography } from "@material-ui/core";
import axios from "axios";
import { push } from "connected-react-router";
import { wrap } from "lodash";
import React, { useState } from "react";
import { Field, reduxForm } from "redux-form";
import { MANUALLY_ENTER_INMATE_FORM } from "../../../sharedUtilities/constants";
import styles from "../../common/globalStyling/styles";
import { snackbarSuccess } from "../actionCreators/snackBarActionCreators";
import { renderTextField } from "../cases/sharedFormComponents/renderFunctions";
import { PrimaryButton } from "../shared/components/StyledButtons";

const ManuallyEnterInmateForm = props => {
  const [submitting, setSubmitting] = useState(false);

  const submit = (values, dispatch) => {
    setSubmitting(true);
    axios
      .post(`api/cases/${props.caseId}/inmates`, {
        ...values,
        roleOnCase: props.roleOnCase
      })
      .then(() => {
        dispatch(
          snackbarSuccess("Successfully added Person in Custody to case")
        );
        dispatch(push(`/cases/${props.caseId}`));
      })
      .catch(err => {})
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <form onSubmit={props.handleSubmit(submit)}>
      <Typography variant="h6" style={{ marginBottom: "16px" }}>
        Additional Info
      </Typography>
      <Card style={{ backgroundColor: "white", marginBottom: "16px" }}>
        <CardContent>
          <Typography style={styles.section}>
            Complainant Information
          </Typography>
          <div
            style={{
              marginTop: "24px",
              marginBottom: "50px",
              display: "flex",
              justifyContent: "start",
              columnGap: "40px",
              flexWrap: "wrap"
            }}
          >
            <Field
              component={renderTextField}
              name="firstName"
              inputProps={{ "data-testid": "firstNameField" }}
              placeholder="First Name"
            />
            <Field
              component={renderTextField}
              name="middleInitial"
              inputProps={{ "data-testid": "middleInitialField" }}
              placeholder="M.I."
              style={{ maxWidth: "3em" }}
            />
            <Field
              component={renderTextField}
              name="lastName"
              inputProps={{ "data-testid": "lastNameField" }}
              placeholder="Last Name"
            />
            <Field
              component={renderTextField}
              name="suffix"
              inputProps={{ "data-testid": "suffixField" }}
              placeholder="Suffix"
            />
          </div>
          <div
            style={{
              marginTop: "24px",
              marginBottom: "50px",
              display: "flex",
              justifyContent: "start",
              columnGap: "80px",
              flexWrap: "wrap"
            }}
          >
            <Field
              component={renderTextField}
              name="notFoundInmateId"
              inputProps={{ "data-testid": "inmateIdField" }}
              placeholder="ID Number"
            />
            <Field
              component={renderTextField}
              name="facility"
              inputProps={{ "data-testid": "facilityField" }}
              placeholder="Facility"
              style={{ minWidth: "450px" }}
            />
          </div>
          <Typography style={styles.section}>Notes</Typography>
          <Typography variant="body2">
            Use this section to add notes, a description, or indicate any
            information about the person in custody's history or risk
            assessment.
          </Typography>
          <Field
            component={renderTextField}
            name="notes"
            inputProps={{ "data-testid": "notesField" }}
            multiline
            maxRows={8}
            style={{ width: "60%" }}
          />
        </CardContent>
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
