import React from "react";
import { Field } from "redux-form";
import {
  lastNameNotBlank,
  lastNameRequired
} from "../../../formFieldLevelValidations";
import { renderTextField } from "./renderFunctions";

const LastNameField = props => (
  <Field
    required
    name={props.name}
    component={renderTextField}
    label="Last Name"
    inputProps={{
      maxLength: 25,
      autoComplete: "off",
      "data-testid": "lastNameInput",
      "aria-label": "Last Name Field"
    }}
    data-testid="lastNameField"
    validate={[lastNameRequired, lastNameNotBlank]}
    style={{ width: "140px", marginRight: "5%", marginBottom: "3%" }}
  />
);

export default LastNameField;
