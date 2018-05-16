import React from "react";
import { Field } from "redux-form";
import { TextField } from "redux-form-material-ui";

const MiddleInitialField = props => (
  <Field
    {...props}
    data-test="middleInitialField"
    label="M.I."
    inputProps={{
      "data-test": "middleInitialInput",
      maxLength: 1
    }}
    normalize={(value, previousValue) =>
      value === "" || /^[a-zA-Z]?$/.test(value) ? value : previousValue
    }
    component={TextField}
  />
);

export default MiddleInitialField;
