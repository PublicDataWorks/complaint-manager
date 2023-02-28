import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Field, formValueSelector, change } from "redux-form";
import { FormControlLabel, Typography } from "@material-ui/core";
import FirstNameField from "../../sharedFormComponents/FirstNameField";
import LastNameField from "../../sharedFormComponents/LastNameField";
import {
  genderIdentityIsRequired,
  raceEthnicityIsRequired,
  titleIsRequired
} from "../../../../formFieldLevelValidations";
import Dropdown from "../../../../common/components/Dropdown";
import DateField from "../../sharedFormComponents/DateField";
import MiddleInitialField from "../../sharedFormComponents/MiddleInitialField";
import SuffixField from "../../sharedFormComponents/SuffixField";
import PhoneNumberField from "../../sharedFormComponents/PhoneNumberField";
import EmailField from "../../sharedFormComponents/EmailField";
import moment from "moment";
import { generateMenuOptions } from "../../../utilities/generateMenuOptions";
import AddressInput from "./AddressInput";
import {
  CIVILIAN_FORM_NAME,
  ISO_DATE
} from "../../../../../sharedUtilities/constants";
import AddressSecondLine from "../../sharedFormComponents/AddressSecondLine";
import _ from "lodash";
import PrimaryCheckBox from "../../../shared/components/PrimaryCheckBox";
import { renderTextField } from "../../sharedFormComponents/renderFunctions";
import { formatAddressAsString } from "../../../utilities/formatAddress";

const CivilianFormFields = props => {
  return (
    <>
      <FormControlLabel
        key="isAnonymous"
        label={`Anonymize ${
          props.roleOnCase?.toLowerCase() || ""
        } in referral letter`}
        control={
          <Field
            data-testid="isAnonymous"
            name="isAnonymous"
            component={PrimaryCheckBox}
          />
        }
        onChange={e => {
          if (e.target.checked) {
            props.change("isUnknown", false);
          }
        }}
      />
      <FormControlLabel
        key="isUnknown"
        label={`Unknown ${props.roleOnCase || ""}`}
        control={
          <Field
            data-testid="isUnknown"
            name="isUnknown"
            component={PrimaryCheckBox}
          />
        }
        onChange={e => {
          if (e.target.checked) {
            props.change("isAnonymous", false);
          }
        }}
      />
      {props.isUnknown ? (
        ""
      ) : (
        <>
          <Typography
            variant="subtitle2"
            style={{ marginBottom: "8px", marginTop: "24px" }}
          >
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
              {generateMenuOptions(props.civilianTitles)}
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
                  max: moment(Date.now()).format(ISO_DATE)
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
                marginBottom: "1%",
                marginLeft: "28px"
              }}
              inputProps={{ "data-testid": "genderInput" }}
            >
              {generateMenuOptions(props.genderIdentities)}
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
            {generateMenuOptions(props.raceEthnicities)}
          </Field>
          <Typography
            variant="subtitle2"
            style={{ marginTop: "40px", marginBottom: "8px" }}
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
                formattedAddress={props.formattedAddress}
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

          <Typography
            variant="subtitle2"
            style={{ marginBottom: "8px", marginTop: "24px" }}
          >
            Notes
          </Typography>
          <Field
            name="additionalInfo"
            component={renderTextField}
            style={{ marginBottom: "16px" }}
            fullWidth
            multiline
            maxRows={5}
            placeholder="Enter any additional details about the complainant here"
            inputProps={{
              "data-testid": "additionalInfoInput",
              autoComplete: "off"
            }}
            data-testid="additionalInfoField"
          />
          <Field type={"hidden"} name={"caseId"} component={renderTextField} />
        </>
      )}
    </>
  );
};

CivilianFormFields.propTypes = {
  change: PropTypes.func,
  civilianTitles: PropTypes.array,
  formattedAddress: PropTypes.string,
  genderIdentities: PropTypes.array,
  isUnknown: PropTypes.bool,
  raceEthnicities: PropTypes.array,
  roleOnCase: PropTypes.string
};

export default connect(
  state => {
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
      formattedAddress: formatAddressAsString(values.address),
      raceEthnicities: state.ui.raceEthnicities,
      genderIdentities: state.ui.genderIdentities,
      civilianTitles: state.ui.civilianTitles,
      isUnknown: values.isUnknown,
      roleOnCase: values.roleOnCase
    };
  },
  { change }
)(CivilianFormFields);
