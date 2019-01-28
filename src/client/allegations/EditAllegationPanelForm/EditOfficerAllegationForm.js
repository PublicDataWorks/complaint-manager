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
  allegationDetailsRequired,
  allegationSeverityRequired
} from "../../formFieldLevelValidations";
import { allegationSeverityMenu } from "../../utilities/generateMenus";
import NoBlurTextField from "../../cases/CaseDetails/CivilianDialog/FormSelect";
import { connect } from "react-redux";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

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
    <ExpansionPanelDetails>
      <div style={{ width: "100%", marginLeft: "64px" }}>
        <form>
          <div>
            <Field
              style={{ width: "15%", marginBottom: "32px" }}
              component={NoBlurTextField}
              name="severity"
              inputProps={{
                "data-test": "editAllegationSeverityInput"
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
              component={TextField}
              inputProps={{
                "data-test": "allegationInput"
              }}
              validate={[allegationDetailsRequired, allegationDetailsNotBlank]}
              multiline
              rowsMax={5}
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
            data-test="editAllegationCancel"
            onClick={onCancel}
            style={{ marginRight: "8px" }}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-test="editAllegationSubmit"
            disabled={invalid || pristine}
            onClick={handleSubmit((values, dispatch) => {
              onSubmit(values, dispatch, caseId);
            })}
          >
            Save
          </PrimaryButton>
        </div>
      </div>
    </ExpansionPanelDetails>
  );
};
const mapStateToProps = state => ({ caseId: state.currentCase.details.id });

export default connect(mapStateToProps)(reduxForm()(EditOfficerAllegationForm));
