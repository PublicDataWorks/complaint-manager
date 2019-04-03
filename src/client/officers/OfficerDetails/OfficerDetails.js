import React from "react";
import OfficerSearchTableHeader from "../OfficerSearch/OfficerSearchTableHeader";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  Typography,
  FormControlLabel
} from "@material-ui/core";
import OfficerSearchResultsRow from "../OfficerSearch/OfficerSearchResults/OfficerSearchResultsRow";
import { TextField } from "redux-form-material-ui";
import { Field, reduxForm } from "redux-form";
import styles from "../../globalStyling/styles";
import { PrimaryButton } from "../../shared/components/StyledButtons";
import { ChangeOfficer } from "../OfficerSearch/OfficerSearchResults/officerSearchResultsRowButtons";
import { connect } from "react-redux";
import NoBlurTextField from "../../cases/CaseDetails/CivilianDialog/FormSelect";
import { roleOnCaseMenu } from "../../utilities/generateMenus";
import { officerRoleRequired } from "../../formFieldLevelValidations";
import PrimaryCheckBox from "../../shared/components/PrimaryCheckBox";
import { COMPLAINANT, WITNESS } from "../../../sharedUtilities/constants";

class OfficerDetails extends React.Component {
  constructor(props) {
    super(props);
    let roleOnCase = this.props.roleOnCaseProp;
    if (this.props.selectedOfficer && this.props.selectedOfficer.roleOnCase) {
      roleOnCase = this.props.selectedOfficer.roleOnCase;
    }
    this.state = {
      officerRoleOnCase: roleOnCase
    };
  }

  onSubmit = (values, dispatch) => {
    dispatch(this.props.submitAction(values));
  };

  updateRoleOnCase = values => {
    this.setState({
      officerRoleOnCase: values.target.value
    });
  };

  shouldShowAnonymousCheckbox = () => {
    if (
      this.state.officerRoleOnCase !== null &&
      (this.state.officerRoleOnCase === COMPLAINANT ||
        this.state.officerRoleOnCase === WITNESS)
    ) {
      return true;
    }
    return false;
  };

  render() {
    return (
      <div>
        <Typography variant="title">Selected Officer</Typography>
        {this.props.selectedOfficerData ? (
          <Table style={{ marginBottom: "32px" }}>
            <OfficerSearchTableHeader />
            <TableBody>
              <OfficerSearchResultsRow officer={this.props.selectedOfficerData}>
                <ChangeOfficer
                  caseId={this.props.caseId}
                  dispatch={this.props.dispatch}
                  officerSearchUrl={this.props.officerSearchUrl}
                >
                  change
                </ChangeOfficer>
              </OfficerSearchResultsRow>
            </TableBody>
          </Table>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start"
            }}
          >
            <Typography
              data-test="unknown-officer-message"
              style={{ marginBottom: "32px" }}
              variant="body1"
            >
              You have selected Unknown Officer. Change this officer to a known
              officer by selecting Search for Officer.
            </Typography>
            <ChangeOfficer
              caseId={this.props.caseId}
              dispatch={this.props.dispatch}
              officerSearchUrl={this.props.officerSearchUrl}
            >
              Search For Officer
            </ChangeOfficer>
          </div>
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
                  component={NoBlurTextField}
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
            onClick={this.props.handleSubmit(this.onSubmit)}
          >
            {this.props.submitButtonText}
          </PrimaryButton>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  let roleOnCaseProp = null;
  if (state.form.OfficerDetails && state.form.OfficerDetails.initial) {
    roleOnCaseProp = state.form.OfficerDetails.initial.roleOnCase;
  }
  return {
    selectedOfficer: state.officers.selectedOfficerData,
    roleOnCaseProp: roleOnCaseProp
  };
};
const ConnectedComponent = connect(mapStateToProps)(OfficerDetails);

export default reduxForm({
  form: "OfficerDetails"
})(ConnectedComponent);
