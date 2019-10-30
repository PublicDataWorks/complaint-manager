import React, { Component } from "react";
import moment from "moment/moment";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { TextField } from "redux-form-material-ui";
import DateField from "../../sharedFormComponents/DateField";
import {
  Field,
  formValueSelector,
  reduxForm,
  SubmissionError
} from "redux-form";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";
import editIncidentDetails from "../../thunks/editIncidentDetails";
import { nullifyFieldUnlessValid } from "../../../utilities/fieldNormalizers";
import AddressInput from "../CivilianDialog/AddressInput";
import { connect } from "react-redux";
import { formatAddressAsString } from "../../../utilities/formatAddress";
import { addressMustBeValid } from "../../../../formValidations";
import DropdownSelect from "../CivilianDialog/DropdownSelect";
import {
  generateMenuOptions,
  inputDistrictMenu
} from "../../../utilities/generateMenuOptions";
import AddressSecondLine from "../../sharedFormComponents/AddressSecondLine";
import getIntakeSourceDropdownValues from "../../../intakeSources/thunks/getIntakeSourceDropdownValues";
import AdditionalLocationInfo from "../../sharedFormComponents/AdditionalLocationInfo";
import normalizeAddress from "../../../utilities/normalizeAddress";
import { intakeSourceIsRequired } from "../../../../formFieldLevelValidations";
import { INCIDENT_DETAILS_FORM_NAME } from "../../../../../sharedUtilities/constants";
import getHowDidYouHearAboutUsSourceDropdownValues from "../../../howDidYouHearAboutUsSources/thunks/getHowDidYouHearAboutUsSourceDropdownValues";
import getDistrictDropdownValues from "../../../districts/thunks/getDistrictDropdownValues";

const submitIncidentDetails = (values, dispatch, props) => {
  const errors = addressMustBeValid(props.addressValid);
  if (errors.autoSuggestValue) {
    throw new SubmissionError(errors);
  }

  const normalizedValuesWithId = {
    ...values,
    incidentLocation: normalizeAddress(values.incidentLocation),
    incidentDate: nullifyFieldUnlessValid(values.incidentDate),
    incidentTime: nullifyFieldUnlessValid(values.incidentTime),
    intakeSourceId: nullifyFieldUnlessValid(values.intakeSourceId),
    howDidYouHearAboutUsSourceId: nullifyFieldUnlessValid(
      values.howDidYouHearAboutUsSourceId
    ),
    districtId: nullifyFieldUnlessValid(values.districtId),
    id: props.caseId
  };

  return dispatch(
    editIncidentDetails(normalizedValuesWithId, props.handleDialogClose)
  );
};

const styles = {
  paperWidthSm: {
    maxWidth: "500px"
  }
};

class IncidentDetailsDialog extends Component {
  componentDidMount() {
    this.props.getIntakeSourceDropdownValues();
    this.props.getHowDidYouHearAboutUsSourceDropdownValues();
    this.props.getDistrictDropdownValues();
  }

  render() {
    const props = this.props;

    return (
      <Dialog
        open={props.dialogOpen}
        fullWidth={true}
        classes={{
          paperWidthSm: props.classes.paperWidthSm
        }}
      >
        <DialogTitle data-test="editIncidentDetailsTitle">
          Edit Incident Details
        </DialogTitle>
        <DialogContent>
          <form>
            <div style={{ marginBottom: "16px" }}>
              <DateField
                required={true}
                name="firstContactDate"
                label="First Contacted OIPM"
                data-test="editFirstContactDateField"
                inputProps={{
                  "data-test": "editFirstContactDateInput",
                  type: "date",
                  max: moment(Date.now()).format("YYYY-MM-DD")
                }}
                style={{ display: "inherit" }}
              />
            </div>

            <div>
              <DateField
                name="incidentDate"
                label="Incident Date"
                data-test="editIncidentDateField"
                inputProps={{
                  "data-test": "editIncidentDateInput",
                  type: "date",
                  max: moment(Date.now()).format("YYYY-MM-DD")
                }}
                style={{
                  marginRight: "16px",
                  marginBottom: "16px"
                }}
                clearable={true}
              />
              <Field
                component={TextField}
                name="incidentTime"
                label="Incident Time"
                data-test="editIncidentTimeField"
                inputProps={{
                  "data-test": "editIncidentTimeInput",
                  type: "time"
                }}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <AddressInput
                formName={"IncidentDetails"}
                fieldName={"incidentLocation"}
                addressLabel={"Incident Location"}
                formattedAddress={props.formattedAddress}
              />
            </div>
            <div style={{ display: "flex", marginBottom: "16px" }}>
              <AddressSecondLine
                label={"Address Line 2"}
                fieldName={`incidentLocation`}
                style={{
                  marginRight: "5%",
                  flex: "2"
                }}
              />
              <Field
                label="District"
                name="districtId"
                component={DropdownSelect}
                inputProps={{
                  "data-test": "districtInput"
                }}
                style={{
                  flex: "1"
                }}
                data-test="districtDropdown"
              >
                {generateMenuOptions(this.props.districts, "Unknown")}
              </Field>
            </div>
            <div style={{ display: "flex" }}>
              <AdditionalLocationInfo
                label={"Additional Location Info"}
                fieldName={`incidentLocation`}
                style={{
                  marginRight: "5%",
                  flex: "2"
                }}
              />
              <div style={{ flex: 1 }} />
            </div>
            <div style={{ marginTop: "16px" }}>
              <Field
                required
                name="intakeSourceId"
                component={DropdownSelect}
                label="Intake Source"
                hinttext="Intake Source"
                data-test="intakeSourceDropdown"
                style={{ width: "60%" }}
                validate={[intakeSourceIsRequired]}
              >
                {generateMenuOptions(props.intakeSources)}
              </Field>
            </div>
            <div style={{ marginTop: "16px" }}>
              <Field
                name="howDidYouHearAboutUsSourceId"
                component={DropdownSelect}
                label="How did you hear about us?"
                hinttext="How did you hear about us?"
                data-test="howDidYouHearAboutUsSourceDropdown"
                style={{ width: "60%" }}
              >
                {generateMenuOptions(props.howDidYouHearAboutUsSources)}
              </Field>
            </div>
            <div style={{ display: "flex", marginTop: "16px" }}>
              <Field
                name="pibCaseNumber"
                component={TextField}
                label="PIB Case Number"
                data-test="pibCaseNumber"
                placeholder="Enter PIB Case Number"
                inputProps={{
                  "data-test": "pibCaseNumberInput",
                  maxLength: 25
                }}
                InputLabelProps={{ shrink: true }}
                style={{
                  marginRight: "5%",
                  flex: "2"
                }}
                autoComplete="off"
              />
              <div style={{ flex: 1 }} />
            </div>
          </form>
        </DialogContent>
        <DialogActions
          style={{ justifyContent: "space-between", margin: "16px" }}
        >
          <SecondaryButton
            data-test="cancelEditIncidentDetailsButton"
            onClick={props.handleDialogClose}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-test="saveIncidentDetailsButton"
            onClick={props.handleSubmit(submitIncidentDetails)}
            disabled={this.props.submitting}
          >
            Save
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

const connectedForm = reduxForm({ form: INCIDENT_DETAILS_FORM_NAME })(
  IncidentDetailsDialog
);

const mapStateToProps = state => {
  const selector = formValueSelector(INCIDENT_DETAILS_FORM_NAME);
  const values = selector(
    state,
    "incidentLocation.streetAddress",
    "incidentLocation.intersection",
    "incidentLocation.city",
    "incidentLocation.state",
    "incidentLocation.zipCode",
    "incidentLocation.country",
    "incidentLocation.lat",
    "incidentLocation.lng",
    "incidentLocation.placeId"
  );

  return {
    formattedAddress: formatAddressAsString(values.incidentLocation),
    addressValid: state.ui.addressInput.addressValid,
    intakeSources: state.ui.intakeSources,
    howDidYouHearAboutUsSources: state.ui.howDidYouHearAboutUsSources,
    districts: state.ui.districts
  };
};

const mapDispatchToProps = {
  getIntakeSourceDropdownValues,
  getHowDidYouHearAboutUsSourceDropdownValues,
  getDistrictDropdownValues
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(connectedForm)
);
