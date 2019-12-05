import React from "react";
import { Field } from "redux-form";
import { renderField } from "./renderFunctions";

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
    component={renderField}
  />
);

export default MiddleInitialField;
