import React from "react";
import { Field } from "redux-form";
import { renderTextField } from "./renderFunctions";

const MiddleInitialField = props => (
  <Field
    {...props}
    data-test="middleInitialField"
    label="M.I."
    inputProps={{
      "data-test": "middleInitialInput",
      autoComplete: "disabled",
      maxLength: 1
    }}
    normalize={(value, previousValue) =>
      value === "" || /^[a-zA-Z]?$/.test(value) ? value : previousValue
    }
    component={renderTextField}
  />
);

export default MiddleInitialField;
