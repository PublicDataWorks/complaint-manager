import React, { Component } from "react";
import moment from "moment/moment";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
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
import { generateMenuOptions } from "../../../utilities/generateMenuOptions";
import AddressSecondLine from "../../sharedFormComponents/AddressSecondLine";
import getIntakeSourceDropdownValues from "../../../intakeSources/thunks/getIntakeSourceDropdownValues";
import AdditionalLocationInfo from "../../sharedFormComponents/AdditionalLocationInfo";
import normalizeAddress from "../../../utilities/normalizeAddress";
import { intakeSourceIsRequired } from "../../../../formFieldLevelValidations";
import {
  INCIDENT_DETAILS_FORM_NAME,
  ISO_DATE
} from "../../../../../sharedUtilities/constants";
import getHowDidYouHearAboutUsSourceDropdownValues from "../../../howDidYouHearAboutUsSources/thunks/getHowDidYouHearAboutUsSourceDropdownValues";
import getDistrictDropdownValues from "../../../districts/thunks/getDistrictDropdownValues";
import { renderTextField } from "../../sharedFormComponents/renderFunctions";
import Dropdown from "../../../../common/components/Dropdown";
import scrollToFirstError from "../../../../common/helpers/scrollToFirstError";
import { userTimezone } from "../../../../common/helpers/userTimezone";

const {
  FIRST_CONTACTED_ORGANIZATION,
  BUREAU_ACRONYM
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

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
    incidentTimezone: nullifyFieldUnlessValid(values.incidentTimezone),
    intakeSourceId: nullifyFieldUnlessValid(values.intakeSourceId),
    howDidYouHearAboutUsSourceId: nullifyFieldUnlessValid(
      values.howDidYouHearAboutUsSourceId
    ),
    districtId: nullifyFieldUnlessValid(values.districtId),
    id: props.caseId
  };
  
  let timezone;
  if(normalizedValuesWithId.incidentDate && !normalizedValuesWithId.incidentTimezone){
      timezone = moment.tz(normalizedValuesWithId.incidentDate, userTimezone).zoneAbbr();
      normalizedValuesWithId.incidentTimezone = timezone;
  }

  return dispatch(
    editIncidentDetails(normalizedValuesWithId, props.handleDialogClose)
  );
};

const styles = {
  paperWidthSm: {
    maxWidth: "500px"
  }
};

const timezoneGuess = moment.tz(Date.now(), userTimezone).zoneAbbr();
const timezones = ["AST","ADT","CST", "CDT", "EST", "EDT", "MST", "MDT", "PST", "PDT"];

class IncidentDetailsDialog extends Component {
  componentDidMount() {
    this.props.getIntakeSourceDropdownValues();
    this.props.getHowDidYouHearAboutUsSourceDropdownValues();
    this.props.getDistrictDropdownValues();
  }

  render() {
    const props = this.props;
    const pbCaseNumberText = `${BUREAU_ACRONYM} Case Number`;
    const enterPbCaseNumberText = `Enter ${pbCaseNumberText}`;

    return (
      <Dialog
        open={props.dialogOpen}
        fullWidth={true}
        classes={{
          paperWidthSm: props.classes.paperWidthSm
        }}
      >
        <DialogTitle data-testid="editIncidentDetailsTitle">
          Edit Incident Details
        </DialogTitle>
        <DialogContent>
          <form>
            <div style={{ marginBottom: "16px" }}>
              <DateField
                required
                name="firstContactDate"
                label={FIRST_CONTACTED_ORGANIZATION}
                data-testid="editFirstContactDateField"
                inputProps={{
                  "data-testid": "editFirstContactDateInput",
                  type: "date",
                  autoComplete: "off",
                  max: moment(Date.now()).format(ISO_DATE)
                }}
                style={{ display: "inherit" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                marginBottom: "16px",
                width: "100%",
              }}
            >
              <DateField
                name="incidentDate"
                data-testid="editIncidentDateField"
                label="Incident Date"
                inputProps={{
                  "data-testid": "editIncidentDateInput",
                  type: "date",
                  max: moment(Date.now()).format(ISO_DATE),
                  autoComplete: "off"
                }}
                style={{
                  marginRight: "16px"
                }}
                clearable={true}
              />
              <Field
                component={renderTextField}
                name="incidentTime"
                label="Incident Time"
                data-testid="editIncidentTimeField"
                inputProps={{
                  "data-testid": "editIncidentTimeInput",
                  type: "time",
                  autoComplete: "off"
                }}
                InputLabelProps={{
                  shrink: true
                }}
                style={{
                  marginRight: "16px"
                }}
              />
              <Field
                name="incidentTimezone"
                component={Dropdown}
                label="Incident Timezone"
                data-testid="editIncidentTimezoneDropdown"
                inputProps={{
                  "data-testid": "editIncidentTimezoneInput",
                  type: "string",
                  autoComplete: "off"                
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ width: "33.5%" }}
              >
                {generateMenuOptions(timezones, timezoneGuess)}
              </Field>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <AddressInput
                name={"autoSuggestValue"}
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
                component={Dropdown}
                style={{
                  flex: "1"
                }}
                data-testid="districtDropdown"
                inputProps={{
                  "data-testid": "districtInput",
                  autoComplete: "off"
                }}
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
                component={Dropdown}
                label="Intake Source"
                hinttext="Intake Source"
                data-testid="intakeSourceDropdown"
                inputProps={{
                  "data-testid": "intakeSourceInput"
                }}
                style={{ width: "60%" }}
                validate={[intakeSourceIsRequired]}
              >
                {generateMenuOptions(props.intakeSources)}
              </Field>
            </div>
            <div style={{ marginTop: "16px" }}>
              <Field
                name="howDidYouHearAboutUsSourceId"
                component={Dropdown}
                label="How did you hear about us?"
                hinttext="How did you hear about us?"
                data-testid="howDidYouHearAboutUsSourceDropdown"
                inputProps={{
                  "data-testid": "howDidYouHearAboutUsSourceInput"
                }}
                style={{ width: "60%" }}
              >
                {generateMenuOptions(props.howDidYouHearAboutUsSources)}
              </Field>
            </div>
            <div style={{ display: "flex", marginTop: "16px" }}>
              <Field
                name="pibCaseNumber"
                component={renderTextField}
                label={pbCaseNumberText}
                data-testid="pibCaseNumber"
                placeholder={enterPbCaseNumberText}
                inputProps={{
                  "data-testid": "pibCaseNumberInput",
                  maxLength: 25,
                  autoComplete: "off"
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
            data-testid="cancelEditIncidentDetailsButton"
            onClick={props.handleDialogClose}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-testid="saveIncidentDetailsButton"
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

const connectedForm = reduxForm({
  form: INCIDENT_DETAILS_FORM_NAME,
  onSubmitFail: scrollToFirstError
})(IncidentDetailsDialog);

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
  connect(mapStateToProps, mapDispatchToProps)(connectedForm)
);
