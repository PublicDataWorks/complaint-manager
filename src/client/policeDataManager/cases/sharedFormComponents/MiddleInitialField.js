import React from "react";
import { Field } from "redux-form";
import { renderTextField } from "./renderFunctions";

const MiddleInitialField = props => (
  <Field
    {...props}
    data-testid="middleInitialField"
    label="M.I."
    inputProps={{
      "data-testid": "middleInitialInput",
      autoComplete: "off",
      maxLength: 1,
      "aria-label": "Middle Initial Field"
    }}
    normalize={(value, previousValue) =>
      value === "" || /^[a-zA-Z]?$/.test(value) ? value : previousValue
    }
    component={renderTextField}
  />
);

export default MiddleInitialField;
