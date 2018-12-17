import React from "react";
import { Field } from "redux-form";
import { TextField } from "redux-form-material-ui";
import {
  firstNameNotBlank,
  firstNameRequired
} from "../../formFieldLevelValidations";

const FirstNameField = props => (
  <Field
    required
    name={props.name}
    component={TextField}
    label="First Name"
    inputProps={{
      maxLength: 25,
      autoComplete: "disabled",
      "data-test": "firstNameInput"
    }}
    data-test="firstNameField"
    validate={[firstNameRequired, firstNameNotBlank]}
    style={{ width: "140px", marginRight: "5%", marginBottom: "3%" }}
  />
);

export default FirstNameField;
