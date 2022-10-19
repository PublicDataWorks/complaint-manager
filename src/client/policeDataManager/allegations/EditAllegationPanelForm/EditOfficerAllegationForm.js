import { Field, reduxForm } from "redux-form";
import {
  PrimaryButton,
  SecondaryButton
} from "../../shared/components/StyledButtons";
import React from "react";
import editOfficerAllegation from "../../cases/thunks/editOfficerAllegation";
import {
  allegationDetailsNotBlank,
  allegationDetailsRequired,
  allegationSeverityRequired
} from "../../../formFieldLevelValidations";
import { allegationSeverityMenu } from "../../utilities/generateMenuOptions";
import Dropdown from "../../../common/components/Dropdown";
import { connect } from "react-redux";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { renderTextField } from "../../cases/sharedFormComponents/renderFunctions";

const onSubmit = (values, dispatch, caseId) => {
  const { id, details, severity } = values;
  dispatch(editOfficerAllegation({ id, details, severity }, caseId));
};

const EditOfficerAllegationForm = ({
  handleSubmit,
  onCancel,
  invalid,
  pristine,
  caseId
}) => {
  return (
    <AccordionDetails>
      <div style={{ width: "100%", marginLeft: "64px" }}>
        <form>
          <div>
            <Field
              style={{ width: "15%", marginBottom: "32px" }}
              component={Dropdown}
              name="severity"
              inputProps={{
                "data-testid": "editAllegationSeverityInput"
              }}
              label="Allegation Severity"
              validate={[allegationSeverityRequired]}
            >
              {allegationSeverityMenu}
            </Field>
          </div>
          <div>
            <Field
              label={"Allegation Details"}
              name={"details"}
              component={renderTextField}
              inputProps={{
                "data-testid": "allegationInput"
              }}
              validate={[allegationDetailsRequired, allegationDetailsNotBlank]}
              multiline
              maxRows={5}
              style={{ width: "42%", marginBottom: `16px` }}
            />
          </div>
        </form>
        <div
          style={{
            display: "flex"
          }}
        >
          <SecondaryButton
            data-testid="editAllegationCancel"
            onClick={onCancel}
            style={{ marginRight: "8px" }}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-testid="editAllegationSubmit"
            disabled={invalid || pristine}
            onClick={handleSubmit((values, dispatch) => {
              onSubmit(values, dispatch, caseId);
            })}
          >
            Save
          </PrimaryButton>
        </div>
      </div>
    </AccordionDetails>
  );
};
const mapStateToProps = state => ({ caseId: state.currentCase.details.id });

export default connect(mapStateToProps)(reduxForm()(EditOfficerAllegationForm));
