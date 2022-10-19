import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { PrimaryButton } from "../shared/components/StyledButtons";
import createOfficerAllegation from "../cases/thunks/createOfficerAllegation";
import {
  allegationDetailsNotBlank,
  allegationDetailsRequired,
  allegationSeverityRequired
} from "../../formFieldLevelValidations";
import Dropdown from "../../common/components/Dropdown";
import { allegationSeverityMenu } from "../utilities/generateMenuOptions";
import { ALLEGATION_DETAILS_LABEL } from "../../../sharedUtilities/constants";
import { renderTextField } from "../cases/sharedFormComponents/renderFunctions";

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
          component={Dropdown}
          data-testid="allegationSeverityField"
          name="severity"
          inputProps={{ "data-testid": "allegationSeverityInput" }}
          label="Allegation Severity"
          validate={[allegationSeverityRequired]}
        >
          {allegationSeverityMenu}
        </Field>
      </div>
      <div>
        <Field
          validate={[allegationDetailsRequired, allegationDetailsNotBlank]}
          data-testid="allegationDetailsField"
          style={{ width: "40%", marginBottom: `${marginBottomOffset}px` }}
          component={renderTextField}
          name="details"
          inputProps={{
            autoComplete: "off",
            "data-testid": "allegationDetailsInput"
          }}
          multiline
          maxRows={5}
          label={ALLEGATION_DETAILS_LABEL}
        />
      </div>
      <div
        style={{
          marginBottom: `${marginBottomOffset}px`
        }}
      >
        <PrimaryButton
          disabled={props.invalid || props.pristine}
          data-testid="addAllegationButton"
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
