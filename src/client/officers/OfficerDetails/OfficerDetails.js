import React from "react";
import {
  Card,
  CardContent,
  Typography,
  FormControlLabel
} from "@material-ui/core";
import { TextField } from "redux-form-material-ui";
import { Field, reduxForm } from "redux-form";
import styles from "../../globalStyling/styles";
import { PrimaryButton } from "../../shared/components/StyledButtons";
import DropdownSelect from "../../cases/CaseDetails/CivilianDialog/DropdownSelect";
import { roleOnCaseMenu } from "../../utilities/generateMenuOptions";
import { officerRoleRequired } from "../../formFieldLevelValidations";
import PrimaryCheckBox from "../../shared/components/PrimaryCheckBox";
import {
  COMPLAINANT,
  OFFICER_DETAILS_FORM_NAME,
  WITNESS
} from "../../../sharedUtilities/constants";

import SelectedOfficerDisplay from "./SelectedOfficerDisplay";
import UnknownOfficerDisplay from "./UnknownOfficerDisplay";

class OfficerDetails extends React.Component {
  onSubmit = (values, dispatch) => {
    dispatch(this.props.submitAction(values));
  };

  updateRoleOnCase = values => {
    this.setState({
      roleOnCase: values
    });
  };

  shouldShowAnonymousCheckbox = () => {
    const roleOnCase =
      (this.state && this.state.roleOnCase) || this.props.initialRoleOnCase;
    return (
      (roleOnCase === COMPLAINANT || roleOnCase === WITNESS) &&
      this.props.selectedOfficer
    );
  };

  render() {
    return (
      <div>
        <Typography variant="title">Selected Officer</Typography>
        {this.props.selectedOfficer ? (
          <SelectedOfficerDisplay {...this.props} />
        ) : (
          <UnknownOfficerDisplay {...this.props} />
        )}
        <Typography variant="title" style={{ marginBottom: "16px" }}>
          Additional Info
        </Typography>
        <Card style={{ backgroundColor: "white", marginBottom: "16px" }}>
          <CardContent>
            <form>
              <div style={{ marginBottom: "24px" }}>
                <Field
                  inputProps={{
                    "data-test": "roleOnCaseDropdownInput"
                  }}
                  data-test="roleOnCaseDropdown"
                  component={DropdownSelect}
                  name="roleOnCase"
                  required
                  validate={[officerRoleRequired]}
                  label="Role on Case"
                  style={{ width: "9rem" }}
                  onChange={this.updateRoleOnCase}
                >
                  {roleOnCaseMenu}
                </Field>
                <br />
                {!this.shouldShowAnonymousCheckbox() ? null : (
                  <FormControlLabel
                    data-test="isOfficerAnonymous"
                    key="isAnonymous"
                    label="Anonymize officer in referral letter"
                    control={
                      <Field name="isAnonymous" component={PrimaryCheckBox} />
                    }
                  />
                )}
              </div>
              <Typography style={styles.section}>Notes</Typography>
              <Typography variant="body1">
                Use this section to add notes, a description, or indicate any
                information about the officer’s history or risk assessment.
              </Typography>
              <Field
                component={TextField}
                name="notes"
                multiline
                style={{ width: "60%" }}
              />
            </form>
          </CardContent>
        </Card>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <PrimaryButton
            data-test="officerSubmitButton"
            disabled={this.props.submitting}
            onClick={this.props.handleSubmit(this.onSubmit)}
          >
            {this.props.submitButtonText}
          </PrimaryButton>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: OFFICER_DETAILS_FORM_NAME
})(OfficerDetails);
