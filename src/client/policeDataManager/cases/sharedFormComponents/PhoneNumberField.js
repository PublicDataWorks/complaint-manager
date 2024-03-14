import React from "react";
import { Field } from "redux-form";
import { isPhoneNumber} from "../../../formFieldLevelValidations";
import MaskedInput from "react-text-mask";
import { renderTextField } from "./renderFunctions";

function strip_nondigits(value) {
  return value.replace(/[^\d]/g, "");
}

const TextMaskCustom = props => {
  const passedProps = (({ inputRef, ...passedProps }) => ({
    ...passedProps
  }))(props);

  return (
    <MaskedInput
      {...passedProps}
      mask={[
        "(",
        /[1-9]/,
        /\d/,
        /\d/,
        ")",
        " ",
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/
      ]}
      placeholderChar={"\u2000"}
    />
  );
};

const PhoneNumberField = props => {
  return (
    <Field
      name={props.name}
      InputProps={{ inputComponent: TextMaskCustom }}
      component={renderTextField}
      label="Phone Number"
      inputProps={{
        "data-testid": "phoneNumberInput",
        autoComplete: "off",
        "aria-label": "Phone Number Field"
      }}
      data-testid="phoneNumberField"
      validate={[props.OneFormOfContactRequired, isPhoneNumber]}
      normalize={strip_nondigits}
      style={{ width: "35%", marginRight: "0%", marginBottom: "3%" }}
      InputLabelProps={{
        shrink: true
      }}
      placeholder="Ex. 1231231234"
    />
  );
};

export default PhoneNumberField;
