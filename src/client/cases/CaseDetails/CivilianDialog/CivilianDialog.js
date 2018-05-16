import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Field,
  formValueSelector,
  reduxForm,
  SubmissionError
} from "redux-form";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "material-ui";
import RoleOnCaseRadioGroup from "./RoleOnCaseRadioGroup";
import FirstNameField from "../../sharedFormComponents/FirstNameField";
import LastNameField from "../../sharedFormComponents/LastNameField";
import {
  SecondaryButton,
  PrimaryButton
} from "../../../sharedComponents/StyledButtons";
import {
  closeEditDialog,
  updateAddressAutoSuggest
} from "../../../actionCreators/casesActionCreators";
import {
  genderIdentityIsRequired,
  raceEthnicityIsRequired
} from "../../../formFieldLevelValidations";
import NoBlurTextField from "./FormSelect";
import { withTheme } from "material-ui/styles/index";
import DateField from "../../sharedFormComponents/DateField";
import MiddleInitialField from "../../sharedFormComponents/MiddleInitialField";
import SuffixField from "../../sharedFormComponents/SuffixField";
import PhoneNumberField from "../../sharedFormComponents/PhoneNumberField";
import EmailField from "../../sharedFormComponents/EmailField";
import formatAddress from "../../../utilities/formatAddress";
import moment from "moment";
import {
  genderIdentityMenu,
  raceEthnicityMenu
} from "../../../utilities/generateMenus";
import validate from "./helpers/validateCivilianFields";
import AddressInput from "./AddressInput";
import { TextField } from "redux-form-material-ui";
import { CIVILIAN_FORM_NAME } from "../../../../sharedUtilities/constants";
import { nullifyFieldUnlessValid } from "../../../utilities/fieldNormalizers";
import { addressMustBeAutoSuggested } from "../../../formValidations";
import AdditionalAddressInfoField from "../../sharedFormComponents/AdditionalAddressInfoField";

class CivilianDialog extends Component {
  handleCivilian = (values, dispatch) => {
    const errors = addressMustBeAutoSuggested(
      values.address,
      this.props.addressAutoSuggestValue
    );

    if (errors.autoSuggestValue) {
      throw new SubmissionError(errors);
    }

    dispatch(
      this.props.submitAction({
        ...values,
        birthDate: nullifyFieldUnlessValid(values.birthDate)
      })
    );
  };

  render() {
    return (
      <Dialog open={this.props.open} fullWidth>
        <DialogTitle data-test="editDialogTitle">
          {this.props.title}
        </DialogTitle>
        <DialogContent style={{ padding: "0px 24px" }}>
          <form>
            <Field type={"hidden"} name={"caseId"} component={TextField} />
            <Field
              name="roleOnCase"
              component={RoleOnCaseRadioGroup}
              style={{ marginBottom: "8px" }}
            />

            <Typography variant="body2" style={{ marginBottom: "8px" }}>
              Personal Information
            </Typography>
            <FirstNameField name="firstName" />
            <MiddleInitialField
              name="middleInitial"
              style={{
                width: "40px",
                marginRight: "5%"
              }}
            />
            <LastNameField name="lastName" />
            <SuffixField
              name="suffix"
              style={{
                width: "120px"
              }}
            />
            <div style={{ display: "flex" }}>
              <DateField
                name="birthDate"
                label="Birthday"
                data-test="birthDateField"
                inputProps={{
                  "data-test": "birthDateInput",
                  type: "date",
                  max: moment(Date.now()).format("YYYY-MM-DD")
                }}
                clearable={true}
                style={{
                  minWidth: "140px",
                  marginRight: "5%",
                  marginBottom: "3%"
                }}
              />
              <Field
                required
                name="genderIdentity"
                component={NoBlurTextField}
                label="Gender Identity"
                hinttext="Gender Identity"
                data-test="genderDropdown"
                style={{ width: "30%" }}
                validate={[genderIdentityIsRequired]}
              >
                {genderIdentityMenu}
              </Field>
            </div>
            <Field
              required
              name="raceEthnicity"
              component={NoBlurTextField}
              label="Race/Ethnicity"
              hinttext="Race/Ethnicity"
              data-test="raceDropdown"
              style={{ width: "75%", marginBottom: "24px" }}
              validate={[raceEthnicityIsRequired]}
            >
              {raceEthnicityMenu}
            </Field>

            <Typography variant="body2" style={{ marginBottom: "8px" }}>
              Contact Information
            </Typography>
            <PhoneNumberField name="phoneNumber" />
            <EmailField name="email" />
            <AddressInput
              formName={CIVILIAN_FORM_NAME}
              fieldName={"address"}
              addressLabel={"Address"}
              onInputChanged={updateAddressAutoSuggest}
              formattedAddress={this.props.formattedAddress}
            />
            <AdditionalAddressInfoField
              label={"Additional Address Information"}
              fieldName={`address`}
              style={{
                marginRight: "5%",
                marginBottom: "24px",
                width: "50%"
              }}
            />

            <Typography variant="body2" style={{ marginBottom: "8px" }}>
              Notes
            </Typography>
            <Field
              name="additionalInfo"
              component={TextField}
              style={{ marginBottom: "16px" }}
              fullWidth
              multiline
              rowsMax={5}
              placeholder="Enter any additional details about the complainant here"
              inputProps={{
                "data-test": "additionalInfoInput"
              }}
              data-test="additionalInfoField"
            />
          </form>
        </DialogContent>
        <DialogActions
          style={{
            justifyContent: "space-between",
            margin: `${this.props.theme.spacing.unit * 2}px`
          }}
        >
          <SecondaryButton
            data-test="cancelEditCivilian"
            onClick={() => this.props.dispatch(closeEditDialog())}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-test="submitEditCivilian"
            onClick={this.props.handleSubmit(this.handleCivilian)}
          >
            {this.props.submitButtonText}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

const DialogWithTheme = withTheme()(CivilianDialog);

const connectedForm = reduxForm({
  form: CIVILIAN_FORM_NAME,
  validate
})(DialogWithTheme);

const mapStateToProps = state => {
  const selector = formValueSelector(CIVILIAN_FORM_NAME);
  const values = selector(
    state,
    "address.streetAddress",
    "address.intersection",
    "address.city",
    "address.state",
    "address.zipCode",
    "address.country"
  );

  return {
    open: state.ui.civilianDialog.open,
    addressAutoSuggestValue: state.ui.civilianDialog.addressAutoSuggestValue,
    formattedAddress: formatAddress(values.address),
    submitAction: state.ui.civilianDialog.submitAction,
    title: state.ui.civilianDialog.title,
    submitButtonText: state.ui.civilianDialog.submitButtonText
  };
};

export default connect(mapStateToProps)(connectedForm);
