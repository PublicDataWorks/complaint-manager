import React from "react";
import { Field } from "redux-form";
import {
  lastNameNotBlank,
  lastNameRequired
} from "../../../formFieldLevelValidations";
import { renderField } from "./renderFunctions";

const LastNameField = props => (
  <Field
    required
    name={props.name}
    component={renderField}
    label="Last Name"
    inputProps={{
      maxLength: 25,
      autoComplete: "disabled",
      "data-test": "lastNameInput"
    }}
    data-test="lastNameField"
    validate={[lastNameRequired, lastNameNotBlank]}
    style={{ width: "140px", marginRight: "5%", marginBottom: "3%" }}
  />
);

export default LastNameField;
