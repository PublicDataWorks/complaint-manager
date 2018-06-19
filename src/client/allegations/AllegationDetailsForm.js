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
          validate={[allegationDetailsRequired, allegationDetailsNotBlank]}
          data-test="allegationDetailsField"
          style={{ width: "40%", marginBottom: "16px" }}
          component={TextField}
          name="details"
          inputProps={{
            autoComplete: "off",
            "data-test": "allegationDetailsInput"
          }}
          multiline
          rowsMax={5}
          label="Allegation Details"
        />
        <div style={{ marginLeft: "16px" }}>
          <PrimaryButton
            disabled={props.invalid || props.pristine}
            data-test="addAllegationButton"
            onClick={props.handleSubmit(onSubmit)}
          >
            Add Allegation
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
