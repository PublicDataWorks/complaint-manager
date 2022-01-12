import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Field,
  formValueSelector,
  reduxForm,
  SubmissionError,
  change
} from "redux-form";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  Typography,
  withStyles
} from "@material-ui/core";
import FirstNameField from "../../sharedFormComponents/FirstNameField";
import LastNameField from "../../sharedFormComponents/LastNameField";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";
import { closeEditCivilianDialog } from "../../../actionCreators/casesActionCreators";
import {
  genderIdentityIsRequired,
  raceEthnicityIsRequired,
  titleIsRequired
} from "../../../../formFieldLevelValidations";
import Dropdown from "../../../../common/components/Dropdown";
import { withTheme } from "@material-ui/core/styles";
import DateField from "../../sharedFormComponents/DateField";
import MiddleInitialField from "../../sharedFormComponents/MiddleInitialField";
import SuffixField from "../../sharedFormComponents/SuffixField";
import PhoneNumberField from "../../sharedFormComponents/PhoneNumberField";
import EmailField from "../../sharedFormComponents/EmailField";
import { formatAddressAsString } from "../../../utilities/formatAddress";
import moment from "moment";
import { generateMenuOptions } from "../../../utilities/generateMenuOptions";
import validate from "./helpers/validateCivilianFields";
import AddressInput from "./AddressInput";
import {
  CIVILIAN_FORM_NAME,
  COMPLAINANT,
  WITNESS
} from "../../../../../sharedUtilities/constants";
import { nullifyFieldUnlessValid } from "../../../utilities/fieldNormalizers";
import { addressMustBeValid } from "../../../../formValidations";
import AddressSecondLine from "../../sharedFormComponents/AddressSecondLine";
import _ from "lodash";
import normalizeAddress from "../../../utilities/normalizeAddress";
import getRaceEthnicityDropdownValues from "../../../raceEthnicities/thunks/getRaceEthnicityDropdownValues";
import getGenderIdentityDropdownValues from "../../../genderIdentities/thunks/getGenderIdentityDropdownValues";
import getCivilianTitleDropdownValues from "../../../civilianTitles/thunks/getCivilianTitleDropdownValues";
import PrimaryCheckBox from "../../../shared/components/PrimaryCheckBox";
import {
  renderRadioGroup,
  renderTextField
} from "../../sharedFormComponents/renderFunctions";
import scrollToFirstError from "../../../../common/helpers/scrollToFirstError";

const styles = {
  dialogPaper: {
    minWidth: "40%",
    maxHeight: "calc(100% - 150px)"
  }
};

class CivilianDialog extends Component {
  componentDidMount() {
    this.props.getRaceEthnicityDropdownValues();
    this.props.getGenderIdentityDropdownValues();
    this.props.getCivilianTitleDropdownValues();
  }

  handleCivilian = (values, dispatch) => {
    if (!values.isUnknown) {
      const errors = addressMustBeValid(this.props.addressValid);

      if (errors.autoSuggestValue) {
        throw new SubmissionError(errors);
      }
      const contactErrors = validate(values);
      if (!_.isEmpty(contactErrors)) {
        throw new SubmissionError(contactErrors);
      }
    }

    dispatch(
      this.props.submitAction({
        ...values,
        isAnonymous: values.isAnonymous || values.isUnknown,
        birthDate: nullifyFieldUnlessValid(values.birthDate),
        address: normalizeAddress(values.address)
      })
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        open={this.props.open}
        classes={{ paper: classes.dialogPaper }}
        fullWidth
      >
        <DialogTitle data-testid="editDialogTitle">
          {this.props.title}
        </DialogTitle>
        <DialogContent style={{ padding: "0px 24px" }}>
          <form>
            <Typography variant="subtitle2" style={{ marginBottom: "8px" }}>
              Role On Case
            </Typography>
            <Field
              name="roleOnCase"
              component={renderRadioGroup}
              style={{ flexDirection: "row", marginBottom: "24px" }}
              data-testid="roleOnCaseRadioGroup"
            >
              <FormControlLabel
                style={{ marginRight: "48px" }}
                value={COMPLAINANT}
                control={<Radio color="primary" />}
                label={COMPLAINANT}
              />
              <FormControlLabel
                style={{ marginRight: "48px" }}
                value={WITNESS}
                control={<Radio color="primary" />}
                label={WITNESS}
              />
            </Field>
            <FormControlLabel
              key="isAnonymous"
              label={`Anonymize ${this.props.roleOnCase?.toLowerCase()} in referral letter`}
              control={
                <Field
                  data-testid="isAnonymous"
                  name="isAnonymous"
                  component={PrimaryCheckBox}
                />
              }
              onChange={e => {
                if (e.target.checked) {
                  this.props.change("isUnknown", false);
                }
              }}
            />
            <FormControlLabel
              key="isUnknown"
              label={`Unknown ${this.props.roleOnCase}`}
              control={
                <Field
                  data-testid="isUnknown"
                  name="isUnknown"
                  component={PrimaryCheckBox}
                />
              }
              onChange={e => {
                if (e.target.checked) {
                  this.props.change("isAnonymous", false);
                }
              }}
            />
            {this.props.isUnknown ? (
              ""
            ) : (
              <>
                <Typography variant="subtitle2" style={{ marginBottom: "8px" }}>
                  Personal Information
                </Typography>
                <div>
                  <Field
                    required
                    name="civilianTitleId"
                    component={Dropdown}
                    label="Title"
                    hinttext="Title"
                    data-testid="titleDropdown"
                    style={{
                      width: "95px",
                      marginBottom: "3%"
                    }}
                    inputProps={{ "data-testid": "titleInput" }}
                    validate={[titleIsRequired]}
                  >
                    {generateMenuOptions(this.props.civilianTitles)}
                  </Field>
                </div>
                <div>
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
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    justifyPosition: "flex-start",
                    marginBottom: "3%"
                  }}
                >
                  <div>
                    <DateField
                      name="birthDate"
                      data-testid="birthDateField"
                      inputProps={{
                        "data-testid": "birthDateInput",
                        type: "date",
                        max: moment(Date.now()).format("YYYY-MM-DD")
                      }}
                      label="Date of Birth"
                      clearable={true}
                      style={{
                        minWidth: "140px",
                        marginRight: "5%"
                      }}
                    />
                  </div>
                  <Field
                    required
                    name="genderIdentityId"
                    component={Dropdown}
                    label="Gender Identity"
                    hinttext="Gender Identity"
                    data-testid="genderDropdown"
                    validate={[genderIdentityIsRequired]}
                    style={{
                      minWidth: "166px",
                      marginBottom: "3%",
                      marginLeft: "28px"
                    }}
                    inputProps={{ "data-testid": "genderInput" }}
                  >
                    {generateMenuOptions(this.props.genderIdentities)}
                  </Field>
                </div>
                <Field
                  required
                  name="raceEthnicityId"
                  component={Dropdown}
                  label="Race/Ethnicity"
                  hinttext="Race/Ethnicity"
                  data-testid="raceDropdown"
                  style={{ width: "75%" }}
                  inputProps={{ "data-testid": "raceEthnicityInput" }}
                  validate={[raceEthnicityIsRequired]}
                >
                  {generateMenuOptions(this.props.raceEthnicities)}
                </Field>
                <Typography
                  variant="subtitle2"
                  style={{ marginTop: "24px", marginBottom: "8px" }}
                >
                  Contact Information
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%"
                  }}
                >
                  <PhoneNumberField name="phoneNumber" />
                  <Typography
                    variant="button"
                    style={{
                      marginLeft: "22px",
                      marginTop: "22px",
                      marginRight: "22px"
                    }}
                  >
                    OR
                  </Typography>
                  <EmailField name="email" autoComplete="disabled" />

                  <Typography
                    variant="button"
                    style={{
                      marginLeft: "22px",
                      marginTop: "22px",
                      marginRight: "22px"
                    }}
                  >
                    OR
                  </Typography>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ marginBottom: "16px", width: "100%" }}>
                    <AddressInput
                      name={"autoSuggestValue"}
                      formName={CIVILIAN_FORM_NAME}
                      fieldName={"address"}
                      addressLabel={"Address"}
                      formattedAddress={this.props.formattedAddress}
                    />
                  </div>
                  <AddressSecondLine
                    label={"Address Line 2"}
                    fieldName={"address"}
                    style={{
                      marginBottom: "24px",
                      width: "50%"
                    }}
                  />
                </div>

                <Typography variant="subtitle2" style={{ marginBottom: "8px" }}>
                  Notes
                </Typography>
                <Field
                  name="additionalInfo"
                  component={renderTextField}
                  style={{ marginBottom: "16px" }}
                  fullWidth
                  multiline
                  rowsMax={5}
                  placeholder="Enter any additional details about the complainant here"
                  inputProps={{
                    "data-testid": "additionalInfoInput",
                    autoComplete: "off"
                  }}
                  data-testid="additionalInfoField"
                />
                <Field
                  type={"hidden"}
                  name={"caseId"}
                  component={renderTextField}
                />
              </>
            )}
          </form>
        </DialogContent>
        <DialogActions
          style={{
            justifyContent: "space-between",
            margin: `${this.props.theme.spacing(2)}px`
          }}
        >
          <SecondaryButton
            data-testid="cancelEditCivilian"
            onClick={() => this.props.dispatch(closeEditCivilianDialog())}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-testid="submitEditCivilian"
            onClick={this.props.handleSubmit(this.handleCivilian)}
            disabled={this.props.submitting}
          >
            {this.props.submitButtonText}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

const DialogWithTheme = withTheme(withStyles(styles)(CivilianDialog));

const connectedForm = reduxForm({
  form: CIVILIAN_FORM_NAME,
  onSubmitFail: scrollToFirstError
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
    "address.country",
    "address.lat",
    "address.lng",
    "address.placeId",
    "isUnknown",
    "roleOnCase"
  );

  return {
    open: state.ui.civilianDialog.open,
    formattedAddress: formatAddressAsString(values.address),
    submitAction: state.ui.civilianDialog.submitAction,
    title: state.ui.civilianDialog.title,
    submitButtonText: state.ui.civilianDialog.submitButtonText,
    addressValid: state.ui.addressInput.addressValid,
    raceEthnicities: state.ui.raceEthnicities,
    genderIdentities: state.ui.genderIdentities,
    civilianTitles: state.ui.civilianTitles,
    isUnknown: values.isUnknown,
    roleOnCase: values.roleOnCase
  };
};

const mapDispatchToProps = {
  getRaceEthnicityDropdownValues,
  getGenderIdentityDropdownValues,
  getCivilianTitleDropdownValues,
  change
};

export default connect(mapStateToProps, mapDispatchToProps)(connectedForm);
