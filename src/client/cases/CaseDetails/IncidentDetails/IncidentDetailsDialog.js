import React from "react";
import moment from "moment/moment";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  withStyles
} from "material-ui";
import { TextField } from "redux-form-material-ui";
import DateField from "../../sharedFormComponents/DateField";
import {
  Field,
  formValueSelector,
  reduxForm,
  SubmissionError
} from "redux-form";
import {
  SecondaryButton,
  PrimaryButton
} from "../../../shared/components/StyledButtons";
import editIncidentDetails from "../../thunks/editIncidentDetails";
import { nullifyFieldUnlessValid } from "../../../utilities/fieldNormalizers";
import AddressInput from "../CivilianDialog/AddressInput";
import { updateIncidentLocationAutoSuggest } from "../../../actionCreators/casesActionCreators";
import { connect } from "react-redux";
import formatAddress from "../../../utilities/formatAddress";
import { addressMustBeAutoSuggested } from "../../../formValidations";
import NoBlurTextField from "../CivilianDialog/FormSelect";
import { inputDistrictMenu } from "../../../utilities/generateMenus";
import AdditionalAddressInfoField from "../../sharedFormComponents/AdditionalAddressInfoField";

const submitIncidentDetails = (values, dispatch, props) => {
  const errors = addressMustBeAutoSuggested(
    values.incidentLocation,
    props.autoSuggestValue
  );

  if (errors.autoSuggestValue) {
    throw new SubmissionError(errors);
  }

  const normalizedValuesWithId = {
    ...values,
    incidentLocationId: props.incidentLocationId,
    incidentDate: nullifyFieldUnlessValid(values.incidentDate),
    incidentTime: nullifyFieldUnlessValid(values.incidentTime),
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

const IncidentDetailsDialog = props => (
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
        <DateField
          required={true}
          name="firstContactDate"
          label="First Contact Date"
          data-test="editFirstContactDateField"
          inputProps={{
            "data-test": "editFirstContactDateInput",
            type: "date",
            max: moment(Date.now()).format("YYYY-MM-DD")
          }}
          style={{ marginBottom: "16px" }}
        />
        <br />
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
        <AddressInput
          formName={"IncidentDetails"}
          fieldName={"incidentLocation"}
          addressLabel={"Incident Location"}
          onInputChanged={updateIncidentLocationAutoSuggest}
          formattedAddress={props.formattedAddress}
        />
        <div style={{ display: "flex" }}>
          <AdditionalAddressInfoField
            label={"Additional Location Info"}
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
              "data-test": "districtDropdown"
            }}
            style={{
              flex: "1"
            }}
          >
            {inputDistrictMenu}
          </Field>
        </div>
      </form>
    </DialogContent>
    <DialogActions style={{ justifyContent: "space-between", margin: "16px" }}>
      <SecondaryButton
        data-test="cancelEditIncidentDetailsButton"
        onClick={props.handleDialogClose}
      >
        Cancel
      </SecondaryButton>
      <PrimaryButton
        data-test="saveIncidentDetailsButton"
        onClick={props.handleSubmit(submitIncidentDetails)}
      >
        Save
      </PrimaryButton>
    </DialogActions>
  </Dialog>
);

const connectedForm = reduxForm({ form: "IncidentDetails" })(
  IncidentDetailsDialog
);

const mapStateToProps = state => {
  const selector = formValueSelector("IncidentDetails");
  const values = selector(
    state,
    "incidentLocation.streetAddress",
    "incidentLocation.intersection",
    "incidentLocation.city",
    "incidentLocation.state",
    "incidentLocation.zipCode",
    "incidentLocation.country"
  );

  return {
    incidentLocationId: state.currentCase.details.incidentLocationId,
    autoSuggestValue: state.ui.incidentDetailsDialog.autoSuggestValue,
    formattedAddress: formatAddress(values.incidentLocation)
  };
};

export default withStyles(styles)(connect(mapStateToProps)(connectedForm));
