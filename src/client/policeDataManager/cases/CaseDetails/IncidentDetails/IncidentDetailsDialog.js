import React, { Component } from "react";
import moment from "moment-timezone";
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
import AddressInput from "../PersonOnCaseDialog/AddressInput";
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
  CONFIGS,
  INCIDENT_DETAILS_FORM_NAME,
  ISO_DATE
} from "../../../../../sharedUtilities/constants";
import getHowDidYouHearAboutUsSourceDropdownValues from "../../../howDidYouHearAboutUsSources/thunks/getHowDidYouHearAboutUsSourceDropdownValues";
import getDistrictDropdownValues from "../../../districts/thunks/getDistrictDropdownValues";
import { renderTextField } from "../../sharedFormComponents/renderFunctions";
import Dropdown from "../../../../common/components/Dropdown";
import scrollToFirstError from "../../../../common/helpers/scrollToFirstError";
import { userTimezone } from "../../../../common/helpers/userTimezone";
import getFacilities from "../../thunks/getFacilities";
import PriorityIncident from "../../sharedFormComponents/PriorityIncident";

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
    priorityReasons: nullifyFieldUnlessValid(values.priorityReason?.id),
    priorityLevels: nullifyFieldUnlessValid(values.priorityLevel?.id),
    howDidYouHearAboutUsSourceId: nullifyFieldUnlessValid(
      values.howDidYouHearAboutUsSourceId
    ),
    districtId: nullifyFieldUnlessValid(values.districtId),
    facilityId: nullifyFieldUnlessValid(values.facilityId),
    housingUnitId: nullifyFieldUnlessValid(values.housingUnitId || ""),
    id: props.caseId,
    nopdCaseNumber: nullifyFieldUnlessValid(values.nopdCaseNumber)
  };

  let timezone;
  if (
    (normalizedValuesWithId.incidentDate ||
      normalizedValuesWithId.incidentTime) &&
    !normalizedValuesWithId.incidentTimezone
  ) {
    if (!normalizedValuesWithId.incidentDate) {
      timezone = moment.tz(moment(), userTimezone).zoneAbbr();
    } else {
      timezone = moment
        .tz(normalizedValuesWithId.incidentDate, userTimezone)
        .zoneAbbr();
    }
    normalizedValuesWithId.incidentTimezone = timezone;
  }

  if (
    props.priorityIncidentsFlag &&
    !normalizedValuesWithId.priorityLevels &&
    !normalizedValuesWithId.priorityLevel
  ) {
    normalizedValuesWithId.priorityLevels = null;
  }

  if (
    props.priorityIncidentsFlag &&
    !normalizedValuesWithId.priorityReasons &&
    !normalizedValuesWithId.priorityReason
  ) {
    normalizedValuesWithId.priorityReasons = null;
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
const timezones = [
  "AST",
  "ADT",
  "CST",
  "CDT",
  "EST",
  "EDT",
  "MST",
  "MDT",
  "PST",
  "PDT"
];

class IncidentDetailsDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownValue: {
        label: "",
        value: null
      },
      currentHousingUnitId: this.props.housingUnitId
    };

    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
  }

  handleDropdownChange(newValue) {
    this.setState({ dropdownValue: newValue });

    if (newValue !== "Priority Incident") {
      this.props.change("priorityLevel.id", null);
      this.props.change("priorityReason.id", null);
    }
  }

  handleCloseDialog() {
    if (!this.props.policeIncidentDetails) {
      this.props.change("housingUnitId", this.state.currentHousingUnitId);
    }

    this.props.handleDialogClose();
  }

  componentDidMount() {
    this.setState({ dropdownValue: this.props.intakeSourceName });
    this.props.getIntakeSourceDropdownValues();
    this.props.getHowDidYouHearAboutUsSourceDropdownValues();

    if (this.props.policeIncidentDetails) {
      this.props.getDistrictDropdownValues();
    } else {
      this.props.getFacilities("housingUnits");
    }
  }

  render() {
    const props = this.props;
    const pbCaseNumberText = `${
      props.configs[CONFIGS.BUREAU_ACRONYM]
    } Case Number`;
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
                label={`First Contacted ${props.configs[CONFIGS.ORGANIZATION]}`}
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
                width: "100%"
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
                  shrink: true
                }}
                style={{ width: "33.5%" }}
              >
                {generateMenuOptions(timezones, timezoneGuess)}
              </Field>
            </div>
            <div style={{ marginBottom: "16px" }}>
              {this.props.policeIncidentDetails && (
                <AddressInput
                  name={"autoSuggestValue"}
                  data-testid="editAddressInput"
                  formName={"IncidentDetails"}
                  fieldName={"incidentLocation"}
                  addressLabel={"Incident Location"}
                  formattedAddress={props.formattedAddress}
                />
              )}
            </div>
            <div style={{ display: "flex", marginBottom: "16px" }}>
              {this.props.policeIncidentDetails && (
                <AddressSecondLine
                  data-testid="editAddressSecondLineInput"
                  label={"Address Line 2"}
                  fieldName={`incidentLocation`}
                  style={{
                    marginRight: "5%",
                    flex: "2"
                  }}
                />
              )}
              {!this.props.policeIncidentDetails && (
                <>
                  <Field
                    label="Facility"
                    name="facilityId"
                    component={Dropdown}
                    data-testid="facilityDropdown"
                    style={{
                      marginRight: "24px",
                      width: "50%"
                    }}
                    inputProps={{
                      "data-testid": "facilityInput",
                      autoComplete: "off"
                    }}
                  >
                    {generateMenuOptions(
                      props.facilities.map(facility => [
                        facility.name,
                        facility.id
                      ]),
                      "      "
                    )}
                  </Field>

                  {props.selectedFacility && (
                    <Field
                      label="Housing Unit"
                      name="housingUnitId"
                      component={Dropdown}
                      data-testid="housingUnitDropdown"
                      style={{ marginRight: "24px", width: "50%" }}
                      inputProps={{
                        "data-testid": "housingUnitInput",
                        autoComplete: "off"
                      }}
                    >
                      {generateMenuOptions(
                        props.facilities && props.selectedFacility
                          ? props.selectedFacility.housingUnits.map(
                              housingUnit => [housingUnit.name, housingUnit.id]
                            )
                          : [],
                        "Unknown"
                      )}
                    </Field>
                  )}
                </>
              )}

              {this.props.policeIncidentDetails && (
                <Field
                  label="District/Assignment"
                  name="districtId"
                  component={Dropdown}
                  style={{
                    flex: "1",
                    witdth: "50%"
                  }}
                  data-testid="districtDropdown"
                  inputProps={{
                    "data-testid": "districtInput",
                    autoComplete: "off"
                  }}
                >
                  {generateMenuOptions(this.props.districts, "Unknown")}
                </Field>
              )}
            </div>
            <div style={{ display: "flex" }}>
              <AdditionalLocationInfo
                data-testid="editAdditionalLocationInfo"
                label={"Additional Location Info"}
                fieldName={`incidentLocation`}
                style={{
                  marginRight: "5%",
                  flex: "2"
                }}
              />
              <div style={{ flex: 1 }} />
            </div>
            <div style={{ marginTop: "16px", marginBottom: "16px" }}>
              <IntakeSource
                handleDropdownChange={this.handleDropdownChange}
                intakeSources={props.intakeSources}
              />
            </div>
            {props.priorityIncidentsFlag && (
              <PriorityIncident
                formName={INCIDENT_DETAILS_FORM_NAME}
                isPriorityIncident={props.isPriorityIncident}
                fieldNames={["priorityLevel.id", "priorityReason.id"]}
              />
            )}
            {props.policeIncidentDetails && (
              <>
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
                <div style={{ display: "flex", marginTop: "16px" }}>
                  <Field
                    name="nopdCaseNumber"
                    component={renderTextField}
                    label="NOPD Case Number"
                    data-testid="editNopdCaseNumber"
                    placeholder="Enter NOPD Case Number"
                    inputProps={{
                      "data-testid": "nopdCaseNumberInput",
                      maxLength: 50,
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
              </>
            )}
          </form>
        </DialogContent>
        <DialogActions
          style={{ justifyContent: "space-between", margin: "16px" }}
        >
          <SecondaryButton
            data-testid="cancelEditIncidentDetailsButton"
            onClick={this.handleCloseDialog}
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

const IntakeSource = props => {
  return (
    <Field
      required
      name="intakeSourceId"
      component={Dropdown}
      label="Intake Source"
      hinttext="Intake Source"
      data-testid="editIntakeSourceDropdown"
      inputProps={{
        "data-testid": "editIntakeSourceInput",
        autoComplete: "off"
      }}
      style={{ width: "60%" }}
      validate={[intakeSourceIsRequired]}
      handleDropdownChange={props.handleDropdownChange}
    >
      {generateMenuOptions(props.intakeSources)}
    </Field>
  );
};

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
    "incidentLocation.placeId",
    "priorityReason.id",
    "facilityId",
    "nopdCaseNumber"
  );

  const selectedFacility = state.facilities.find(
    facility => facility.id === values.facilityId
  );

  return {
    addressValid: state.ui.addressInput.addressValid,
    configs: state.configs,
    districts: state.ui.districts,
    facilities: state.facilities,
    facilityId: state.currentCase.details.facilityId,
    formattedAddress: formatAddressAsString(values.incidentLocation),
    housingUnitId: state.currentCase.details.housingUnitId,
    howDidYouHearAboutUsSources: state.ui.howDidYouHearAboutUsSources,
    intakeSources: state.ui.intakeSources,
    isPriorityIncident: !!values?.priorityReason?.id,
    nopdCaseNumber: state.currentCase.details.nopdCaseNumber,
    policeIncidentDetails: state.featureToggles.policeIncidentDetails,
    priorityIncidentsFlag: state.featureToggles.priorityIncidents,
    priorityLevels: state.ui.priorityLevels,
    priorityReasons: state.ui.priorityReasons,
    selectedFacility
  };
};

const mapDispatchToProps = {
  getIntakeSourceDropdownValues,
  getHowDidYouHearAboutUsSourceDropdownValues,
  getDistrictDropdownValues,
  getFacilities
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(connectedForm)
);
