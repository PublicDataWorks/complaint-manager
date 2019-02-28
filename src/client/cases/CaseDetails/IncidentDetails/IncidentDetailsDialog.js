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
import { addressMustBeValid } from "../../../formValidations";
import NoBlurTextField from "../CivilianDialog/FormSelect";
import {
  generateMenu,
  inputDistrictMenu
} from "../../../utilities/generateMenus";
import AddressSecondLine from "../../sharedFormComponents/AddressSecondLine";
import getClassificationDropDownOptions from "../../../classifications/thunks/getClassificationDropdownValues";
import getIntakeSourceDropdownValues from "../../../intakeSources/thunks/getIntakeSourceDropdownValues";
import AdditionalLocationInfo from "../../sharedFormComponents/AdditionalLocationInfo";
import normalizeAddress from "../../../utilities/normalizeAddress";
import { intakeSourceIsRequired } from "../../../formFieldLevelValidations";
import { INCIDENT_DETAILS_FORM_NAME } from "../../../../sharedUtilities/constants";
import getHeardAboutSourceDropdownValues from "../../../heardAboutSources/thunks/getHeardAboutSourceDropdownValues";

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
    classificationId: nullifyFieldUnlessValid(values.classificationId),
    intakeSourceId: nullifyFieldUnlessValid(values.intakeSourceId),
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
    this.props.getClassificationDropDownOptions();
    this.props.getIntakeSourceDropdownValues();
    this.props.getHeardAboutSourceDropdownValues();
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
                label="First Contacted IPM"
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
                name="district"
                component={NoBlurTextField}
                inputProps={{
                  "data-test": "districtInput"
                }}
                style={{
                  flex: "1"
                }}
                data-test="districtDropdown"
              >
                {inputDistrictMenu}
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
            <div style={{ display: "flex" }}>
              <Field
                label="Incident Classification"
                name="classificationId"
                component={NoBlurTextField}
                inputProps={{ "data-test": "classificationDropdown" }}
                style={{
                  marginRight: "5%",
                  flex: "2"
                }}
              >
                {generateMenu(props.classifications)}
              </Field>
              <div style={{ flex: 1 }} />
            </div>
            <div style={{ marginTop: "16px" }}>
              <Field
                required
                name="intakeSourceId"
                component={NoBlurTextField}
                label="Intake Source"
                hinttext="Intake Source"
                data-test="intakeSourceDropdown"
                style={{ width: "60%" }}
                validate={[intakeSourceIsRequired]}
              >
                {generateMenu(props.intakeSources)}
              </Field>
            </div>
            {/*TODO: Surround in feature toggle*/}
            <div style={{ marginTop: "16px" }}>
              <Field
                required
                name="heardAboutSourceId"
                component={NoBlurTextField}
                label="How did you hear about us?"
                hinttext="How did you hear about us?"
                data-test="heardAboutSourceDropdown"
                style={{ width: "60%" }}
              >
                {generateMenu(props.heardAboutSources)}
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
    classifications: state.ui.classifications,
    intakeSources: state.ui.intakeSources,
    heardAboutSources: state.ui.heardAboutSources
  };
};

const mapDispatchToProps = {
  getClassificationDropDownOptions,
  getIntakeSourceDropdownValues,
  getHeardAboutSourceDropdownValues
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(connectedForm)
);
