import React from "react";
import { Field } from "redux-form";
import { renderTextField } from "./renderFunctions";

const AddressSecondLine = ({ label, fieldName, style }) => {
  return (
    <Field
      label={label}
      name={`${fieldName}.streetAddress2`}
      component={renderTextField}
      style={style}
      inputProps={{
        "data-testid": "streetAddress2Input",
        autoComplete: "disabled", // "off" does not work on chrome
        maxLength: 25,
        "aria-label": "Second Address Line Field"
      }}
      InputLabelProps={{
        shrink: true
      }}
      data-testid="streetAddress2Field"
      placeholder={"Ex: Apt #, Unit, etc"}
    />
  );
};

export default AddressSecondLine;
