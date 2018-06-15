import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { TextField } from "redux-form-material-ui";
import { PrimaryButton } from "../shared/components/StyledButtons";
import createOfficerAllegation from "../cases/thunks/createOfficerAllegation";
import {
  allegationDetailsNotBlank,
  allegationDetailsRequired
} from "../formFieldLevelValidations";

const AllegationDetailsForm = props => {
  const onSubmit = (values, dispatch) => {
    const formValues = { ...values, allegationId: props.allegationId };
    dispatch(
      createOfficerAllegation(
        formValues,
        props.caseId,
        props.caseOfficerId,
        props.addAllegationSuccess
      )
    );
  };
  return (
    <form>
      <div style={{ display: "flex" }}>
        <Field
          required
          validate={[allegationDetailsRequired, allegationDetailsNotBlank]}
          data-test="allegationDetailsField"
          style={{ width: "80%" }}
          component={TextField}
          name="details"
          inputProps={{
            autoComplete: "off",
            "data-test": "allegationDetailsInput"
          }}
          multiline
          rowsMax={5}
          placeholder="Enter allegation details"
        />
        <div style={{ width: "20%", textAlign: "right" }}>
          <PrimaryButton
            disabled={props.invalid}
            data-test="addAllegationButton"
            onClick={props.handleSubmit(onSubmit)}
          >
            Add
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
};

AllegationDetailsForm.propTypes = {
  caseId: PropTypes.string.isRequired,
  caseOfficerId: PropTypes.string.isRequired,
  addAllegationSuccess: PropTypes.func.isRequired
};

export default reduxForm({})(AllegationDetailsForm);
