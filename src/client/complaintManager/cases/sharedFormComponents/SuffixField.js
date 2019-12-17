import React from "react";
import { Field } from "redux-form";
import { renderTextField } from "./renderFunctions";

const SuffixField = props => (
  <Field
    {...props}
    inputProps={{
      "data-test": "suffixInput",
      maxLength: 25,
      autoComplete: "disabled"
    }}
    data-test="suffixField"
    label="Suffix"
    component={renderTextField}
    normalize={(value, previousValue) =>
      value === "" || /^([^#/])*$/.test(value) ? value : previousValue
    }
  />
);

export default SuffixField;
