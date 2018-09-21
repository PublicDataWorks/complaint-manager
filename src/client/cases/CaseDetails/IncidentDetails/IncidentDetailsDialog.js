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
  SecondaryButton,
  PrimaryButton
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
import AdditionalAddressInfoField from "../../sharedFormComponents/AdditionalAddressInfoField";
import getClassificationDropDownOptions from "../../../classifications/thunks/getClassificationDropdownValues";

const submitIncidentDetails = (values, dispatch, props) => {
  const errors = addressMustBeValid(props.addressValid);
  if (errors.autoSuggestValue) {
    throw new SubmissionError(errors);
  }

  const normalizedValuesWithId = {
    ...values,
    incidentDate: nullifyFieldUnlessValid(values.incidentDate),
    incidentTime: nullifyFieldUnlessValid(values.incidentTime),
    classificationId: nullifyFieldUnlessValid(values.classificationId),
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
          >
            Save
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

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
    "incidentLocation.country",
    "incidentLocation.lat",
    "incidentLocation.lng",
    "incidentLocation.placeId"
  );

  return {
    formattedAddress: formatAddressAsString(values.incidentLocation),
    addressValid: state.ui.addressInput.addressValid,
    classifications: state.ui.classifications
  };
};

const mapDispatchToProps = { getClassificationDropDownOptions };

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(connectedForm)
);
