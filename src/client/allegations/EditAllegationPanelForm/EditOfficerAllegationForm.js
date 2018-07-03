import { TextField } from "redux-form-material-ui";
import { Field, reduxForm } from "redux-form";
import {
  PrimaryButton,
  SecondaryButton
} from "../../shared/components/StyledButtons";
import React from "react";
import editOfficerAllegation from "../../cases/thunks/editOfficerAllegation";
import {
  allegationDetailsNotBlank,
  allegationDetailsRequired
} from "../../formFieldLevelValidations";

const onSubmit = (values, dispatch) => {
  const { id, details } = values;
  dispatch(editOfficerAllegation({ id, details }));
};

const DetailsForm = ({ handleSubmit, onCancel, invalid, pristine }) => {
  return (
    <div style={{ width: "100%", marginLeft: "64px" }}>
      <form>
        <Field
          label={"Allegation Details"}
          name={"details"}
          component={TextField}
          inputProps={{
            "data-test": "allegationInput"
          }}
          validate={[allegationDetailsRequired, allegationDetailsNotBlank]}
          multiline
          rowsMax={5}
          style={{ width: "42%", marginBottom: `16px` }}
        />
      </form>
      <div
        style={{
          display: "flex"
        }}
      >
        <SecondaryButton
          data-test="editAllegationCancel"
          onClick={onCancel}
          style={{ marginRight: "8px" }}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          data-test="editAllegationSubmit"
          disabled={invalid || pristine}
          onClick={handleSubmit(onSubmit)}
        >
          Save
        </PrimaryButton>
      </div>
    </div>
  );
};

export default reduxForm()(DetailsForm);
