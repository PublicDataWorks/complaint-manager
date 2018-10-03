import React from "react";
import { Field } from "redux-form";
import { TextField } from "redux-form-material-ui";
import { isPhoneNumber } from "../../formFieldLevelValidations";
import formatPhoneNumberField from "../../utilities/formatPhoneNumberField";

const PhoneNumberField = props => (
  <Field
    name={props.name}
    component={TextField}
    label="Phone Number"
    inputProps={{
      "data-test": "phoneNumberInput"
    }}
    data-test="phoneNumberField"
    validate={[isPhoneNumber]}
    style={{ marginRight: "5%", marginBottom: "3%" }}
    InputLabelProps={{
      shrink: true
    }}
    placeholder="Ex. 1231231234"
    format={formatPhoneNumberField}
  />
);

export default PhoneNumberField;
