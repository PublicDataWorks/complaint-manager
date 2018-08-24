import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { TextField } from "redux-form-material-ui";
import { PrimaryButton } from "../shared/components/StyledButtons";
import createOfficerAllegation from "../cases/thunks/createOfficerAllegation";
import {
  allegationSeverityRequired,
  allegationDetailsNotBlank,
  allegationDetailsRequired
} from "../formFieldLevelValidations";
import NoBlurTextField from "../cases/CaseDetails/CivilianDialog/FormSelect";
import { allegationSeverityMenu } from "../utilities/generateMenus";

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

  const marginBottomOffset = 16;

  return (
    <form style={{ justifyContent: "center" }}>
      <div>
        <Field
          style={{ width: "15%", marginBottom: `${marginBottomOffset}px` }}
          component={NoBlurTextField}
          data-test="allegationSeverityField"
          name="severity"
          inputProps={{
            "data-test": "allegationSeverityInput"
          }}
          label="Allegation Severity"
          validate={[allegationSeverityRequired]}
        >
          {allegationSeverityMenu}
        </Field>
      </div>
      <div>
        <Field
          validate={[allegationDetailsRequired, allegationDetailsNotBlank]}
          data-test="allegationDetailsField"
          style={{ width: "40%", marginBottom: `${marginBottomOffset}px` }}
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
      </div>
      <div
        style={{
          marginBottom: `${marginBottomOffset}px`
        }}
      >
        <PrimaryButton
          disabled={props.invalid || props.pristine}
          data-test="addAllegationButton"
          onClick={props.handleSubmit(onSubmit)}
        >
          Add Allegation
        </PrimaryButton>
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
