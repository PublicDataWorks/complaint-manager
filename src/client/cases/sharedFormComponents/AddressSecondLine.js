import React from "react";
import { Field } from "redux-form";
import { TextField } from "redux-form-material-ui";

const AddressSecondLine = ({ label, fieldName, style }) => {
  return (
    <Field
      label={label}
      name={`${fieldName}.streetAddress2`}
      component={TextField}
      style={style}
      inputProps={{
        "data-test": "streetAddress2Input",
        autoComplete: "disabled", // "off" does not work on chrome
        maxLength: 25
      }}
      InputLabelProps={{
        shrink: true
      }}
      data-test="streetAddress2Field"
      placeholder={"Ex: Apt #, Unit, etc"}
    />
  );
};

export default AddressSecondLine;
